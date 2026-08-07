package database

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewPostgres membuat pool PostgreSQL READ-ONLY (role samapara_ingestor_ro).
// Jika url kosong, mengembalikan nil — Go jalan tanpa fallback DB
// (registry murni Redis cache, cocok untuk uji lokal).
func NewPostgres(ctx context.Context, url string) (*pgxpool.Pool, error) {
	if url == "" {
		return nil, nil
	}

	config, err := pgxpool.ParseConfig(url)
	if err != nil {
		return nil, err
	}

	// Budget kecil: fallback jarang dihot-path (cache hit hampir selalu).
	config.MaxConns = 3
	config.MinConns = 0
	config.MaxConnIdleTime = 5 * time.Minute
	config.MaxConnLifetime = 30 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, err
	}

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, err
	}

	return pool, nil
}
