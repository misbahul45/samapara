// Package mqtt menghandle subscribe topic sampara/+/telemetry.
package mqtt

import (
	"context"
	"encoding/json"
	"log"
	"time"

	paho "github.com/eclipse/paho.mqtt.golang"

	"github.com/misbahul45/sampara/services/telemetry-worker/internal/registry"
	"github.com/misbahul45/sampara/services/telemetry-worker/internal/stream"
)

type Handler struct {
	registry *registry.Registry
	producer *stream.Producer
}

func NewHandler(registry *registry.Registry, producer *stream.Producer) *Handler {
	return &Handler{registry: registry, producer: producer}
}

// Handle dipanggil paho untuk setiap pesan MQTT di topic telemetry.
// Alur: parse JSON -> registry lookup (cache/DB) -> aktif? -> dedup+XADD.
func (h *Handler) Handle(_ paho.Client, message paho.Message) {
	var telemetry stream.Telemetry
	if err := json.Unmarshal(message.Payload(), &telemetry); err != nil {
		log.Printf("invalid telemetry: %v", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	device, err := h.registry.Get(ctx, telemetry.DeviceID)
	if err != nil {
		log.Printf("device lookup: %v", err)
		return
	}

	if !device.Active {
		log.Printf("inactive device: %s", device.ID)
		return
	}

	streamID, err := h.producer.Publish(ctx, telemetry)
	if err != nil {
		log.Printf("stream publish: %v", err)
		return
	}

	if streamID == "" {
		log.Printf("duplicate telemetry device=%s sequence=%d", telemetry.DeviceID, telemetry.Sequence)
		return
	}

	log.Printf("telemetry stream=%s device=%s", streamID, telemetry.DeviceID)
}
