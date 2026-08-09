// Package stream mendefinisikan struktur telemetry dan producer Redis Streams
// dengan dedup atomik (Lua).
package stream

import "time"

// Telemetry payload yang dikirim ESP32 ke topic sampara/{device_id}/telemetry.
type Telemetry struct {
	DeviceID       string    `json:"device_id"`
	Timestamp      time.Time `json:"timestamp"`
	Sequence       int64     `json:"sequence"`
	WeightKg       float64   `json:"weight_kg"`
	DistanceCm     float64   `json:"distance_cm"`
	BatteryPercent float64   `json:"battery_percent"`
	RSSI           int       `json:"rssi"`
}
