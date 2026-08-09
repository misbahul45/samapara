// SAMPARA telemetry_worker — MQTT ingestor → Redis Streams.
//
// Alur: ESP32 → Mosquitto (sampara/{device_id}/telemetry) → Go handler →
// device registry (Redis cache, PostgreSQL READ ONLY fallback) →
// dedup atomik Lua + XADD stream:telemetry → consumer Python (decision_engine).
package main

import (
	"context"
	"log"

	"github.com/misbahul45/sampara/services/telemetry-worker/internal/config"
	"github.com/misbahul45/sampara/services/telemetry-worker/internal/database"
	"github.com/misbahul45/sampara/services/telemetry-worker/internal/httpapi"
	mqttclient "github.com/misbahul45/sampara/services/telemetry-worker/internal/mqtt"
	"github.com/misbahul45/sampara/services/telemetry-worker/internal/registry"
	"github.com/misbahul45/sampara/services/telemetry-worker/internal/stream"
)

func main() {
	ctx := context.Background()
	cfg := config.Load()

	rdb, err := database.NewRedis(ctx, cfg.RedisURL)
	if err != nil {
		log.Fatalf("redis: %v", err)
	}
	defer rdb.Close()

	db, err := database.NewPostgres(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("postgres: %v", err)
	}
	if db != nil {
		defer db.Close()
	}

	deviceRegistry := registry.New(rdb, db)
	producer := stream.NewProducer(rdb)
	handler := mqttclient.NewHandler(deviceRegistry, producer)

	mqttConnection, err := mqttclient.Connect(cfg.MQTTBroker, cfg.MQTTClientID, handler)
	if err != nil {
		log.Fatalf("mqtt: %v", err)
	}
	defer mqttConnection.Disconnect(1000)

	server := httpapi.New(cfg.InternalServiceToken, mqttConnection)

	log.Printf("telemetry_worker :%s", cfg.Port)
	if err := server.Router().Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
