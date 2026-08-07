// Package database berisi koneksi Redis dan PostgreSQL (read-only fallback).
package database

import (
	"context"

	"github.com/redis/go-redis/v9"
)

// NewRedis membuat client Redis dari URL (redis://:pass@host:6379/0).
func NewRedis(ctx context.Context, url string) (*redis.Client, error) {
	options, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}

	client := redis.NewClient(options)
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}

	return client, nil
}
