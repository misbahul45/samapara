// Package registry menyediakan device registry: Redis cache (ditulis Hono)
// dengan fallback PostgreSQL READ ONLY (role sampara_ingestor_ro).
package registry

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

const cacheTTL = 5 * time.Minute

type Device struct {
	ID           string
	SerialNumber string
	Active       bool
}

type Registry struct {
	redis *redis.Client
	db    *pgxpool.Pool
}

func New(rdb *redis.Client, db *pgxpool.Pool) *Registry {
	return &Registry{redis: rdb, db: db}
}

// Get mengambil device dari cache Redis; jika miss, fallback ke PostgreSQL
// lalu menulis kembali cache. Hot path: cache hit — DB hampir tidak dipanggil.
func (r *Registry) Get(ctx context.Context, deviceID string) (*Device, error) {
	key := "registry:device:" + deviceID

	values, err := r.redis.HGetAll(ctx, key).Result()
	if err == nil && len(values) > 0 {
		return &Device{
			ID:           values["id"],
			SerialNumber: values["serial_number"],
			Active:       values["active"] == "1",
		}, nil
	}

	if r.db == nil {
		return nil, errors.New("device not in cache and database fallback disabled")
	}

	var device Device
	err = r.db.QueryRow(ctx, `
		SELECT id::text, serial_number, active
		FROM public.devices
		WHERE id = $1
	`, deviceID).Scan(&device.ID, &device.SerialNumber, &device.Active)
	if err != nil {
		return nil, err
	}

	// Isi cache (best effort) supaya next lookup langsung HIT.
	err = r.redis.HSet(ctx, key, map[string]any{
		"id":            device.ID,
		"serial_number": device.SerialNumber,
		"active":        boolToString(device.Active),
	}).Err()
	if err == nil {
		_ = r.redis.Expire(ctx, key, cacheTTL).Err()
	}

	return &device, nil
}

func boolToString(value bool) string {
	if value {
		return "1"
	}
	return "0"
}
