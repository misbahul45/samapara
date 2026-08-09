// Package config memuat konfigurasi telemetry_worker dari environment.
package config

import "os"

type Config struct {
	Port                 string
	RedisURL             string
	DatabaseURL          string
	MQTTBroker           string
	MQTTClientID         string
	InternalServiceToken string
}

func Load() Config {
	return Config{
		Port:                 getenv("PORT", "8080"),
		RedisURL:             os.Getenv("REDIS_URL"),
		DatabaseURL:          os.Getenv("GO_DATABASE_URL"),
		MQTTBroker:           getenv("MQTT_BROKER", "tcp://mosquitto:1883"),
		MQTTClientID:         getenv("MQTT_CLIENT_ID", "sampara-telemetry-worker"),
		InternalServiceToken: os.Getenv("INTERNAL_SERVICE_TOKEN"),
	}
}

func getenv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
