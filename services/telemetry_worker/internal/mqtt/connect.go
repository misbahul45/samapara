package mqtt

import (
	"fmt"
	"time"

	paho "github.com/eclipse/paho.mqtt.golang"
)

// Connect membuat koneksi MQTT dengan auto-reconnect dan subscribe
// samapara/+/telemetry (QoS 1).
func Connect(broker, clientID string, handler *Handler) (paho.Client, error) {
	options := paho.NewClientOptions()
	options.AddBroker(broker)
	options.SetClientID(clientID)
	options.SetAutoReconnect(true)
	options.SetConnectRetry(true)
	options.SetConnectRetryInterval(3 * time.Second)

	client := paho.NewClient(options)

	token := client.Connect()
	if !token.WaitTimeout(10 * time.Second) {
		return nil, fmt.Errorf("mqtt connect timeout")
	}
	if token.Error() != nil {
		return nil, token.Error()
	}

	sub := client.Subscribe("samapara/+/telemetry", 1, handler.Handle)
	if !sub.WaitTimeout(10 * time.Second) {
		return nil, fmt.Errorf("mqtt subscribe timeout")
	}

	return client, sub.Error()
}
