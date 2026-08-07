// Package httpapi menyediakan internal API (HANYA di network Docker,
// TIDAK di-expose lewat nginx). Dipakai Hono untuk mengirim command MQTT
// ke ESP32 dan cek health.
package httpapi

import (
	"crypto/subtle"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	paho "github.com/eclipse/paho.mqtt.golang"
)

type Server struct {
	token string
	mqtt  paho.Client
}

func New(token string, mqttClient paho.Client) *Server {
	return &Server{token: token, mqtt: mqttClient}
}

// auth memvalidasi `Authorization: Bearer <INTERNAL_SERVICE_TOKEN>`
// dengan constant-time compare.
func (s *Server) auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		expected := "Bearer " + s.token
		actual := c.GetHeader("Authorization")

		if subtle.ConstantTimeCompare([]byte(actual), []byte(expected)) != 1 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"status": false})
			return
		}

		c.Next()
	}
}

func (s *Server) Router() *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())

	internal := router.Group("/internal/v1")
	internal.Use(s.auth())

	internal.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  true,
			"service": "telemetry_worker",
		})
	})

	internal.POST("/devices/:id/commands", s.command)

	return router
}

// command mengirim command MQTT ke topic samapara/{device}/command (QoS 1).
// Response 202 Accepted — ack ESP32 via samapara/{device}/command/ack.
func (s *Server) command(c *gin.Context) {
	var body struct {
		Command string         `json:"command"`
		Payload map[string]any `json:"payload"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"status": false})
		return
	}

	message := map[string]any{
		"command":   body.Command,
		"payload":   body.Payload,
		"timestamp": time.Now().UTC().Format(time.RFC3339Nano),
	}
	data, _ := json.Marshal(message)

	topic := "samapara/" + c.Param("id") + "/command"
	token := s.mqtt.Publish(topic, 1, false, data)

	if !token.WaitTimeout(5 * time.Second) {
		c.JSON(504, gin.H{"status": false})
		return
	}
	if token.Error() != nil {
		c.JSON(500, gin.H{"status": false})
		return
	}

	c.JSON(202, gin.H{"status": true})
}
