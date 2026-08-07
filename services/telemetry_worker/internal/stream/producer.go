package stream

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/redis/go-redis/v9"
)

// telemetryScript: SET NX (dedup per device+sequence, TTL 24 jam) dan XADD
// ke stream:telemetry dalam SATU script Lua — atomik di Redis.
//
// Return: stream ID (mis. "1754600000123-0") saat diterima, "" saat duplikat.
var telemetryScript = redis.NewScript(`
if redis.call("SET", KEYS[1], "1", "NX", "EX", ARGV[1]) then
  return redis.call("XADD", KEYS[2], "*",
    "device_id", ARGV[2],
    "timestamp", ARGV[3],
    "sequence", ARGV[4],
    "weight_kg", ARGV[5],
    "distance_cm", ARGV[6],
    "battery_percent", ARGV[7],
    "rssi", ARGV[8],
    "raw_json", ARGV[9])
end
return ""
`)

const (
	dedupTTLSeconds = 86400
	streamName      = "stream:telemetry"
)

type Producer struct {
	redis *redis.Client
}

func NewProducer(client *redis.Client) *Producer {
	return &Producer{redis: client}
}

// Publish meng-XADD telemetry ke stream:telemetry dengan dedup atomik.
// Mengembalikan stream ID baru, atau "" jika message sudah pernah dikirim
// (duplicate device_id+sequence dalam 24 jam).
func (p *Producer) Publish(ctx context.Context, data Telemetry) (string, error) {
	raw, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	dedupKey := fmt.Sprintf("dedup:telemetry:%s:%d", data.DeviceID, data.Sequence)

	result, err := telemetryScript.Run(ctx, p.redis,
		[]string{dedupKey, streamName},
		dedupTTLSeconds,
		data.DeviceID,
		data.Timestamp.UTC().Format("2006-01-02T15:04:05.999999999Z07:00"),
		data.Sequence,
		data.WeightKg,
		data.DistanceCm,
		data.BatteryPercent,
		data.RSSI,
		string(raw),
	).Result()
	if err != nil {
		return "", err
	}

	if result == nil || result == "" {
		return "", nil
	}

	return fmt.Sprint(result), nil
}
