<script setup lang="ts">
import { computed } from 'vue'
import { useDeviceDetailQuery, useRunForecastMutation } from '~/queries/useDevicesQuery'

const route = useRoute()
const deviceId = computed(() => String(route.params.id ?? ''))

const { data, isPending, isError, error } = useDeviceDetailQuery(deviceId.value)
const { mutate, isPending: isRunning, isSuccess, error: runError } = useRunForecastMutation()

const forecast = computed(() => {
  const latest = data.value?.latest_forecast
  if (!latest || typeof latest !== 'object') {
    return null
  }
  const record = latest as { p50?: number, p80?: number, p90?: number }
  return { p50: record.p50 ?? null, p80: record.p80 ?? null, p90: record.p90 ?? null }
})

function runForecast() {
  mutate(deviceId.value)
}
</script>

<template>
  <UPage>
    <UPageHeader
      :title="data?.device?.name ?? 'Device'"
      :description="data?.device?.serial_number ?? ''"
    >
      <template #links>
        <UButton
          icon="i-lucide-sparkles"
          label="Jalankan Forecast"
          color="primary"
          :loading="isRunning"
          @click="runForecast"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <UAlert
        v-if="isError"
        color="error"
        icon="i-lucide-alert-triangle"
        title="Gagal memuat device"
        :description="String(error ?? '')"
      />
      <UAlert
        v-else-if="runError"
        color="error"
        icon="i-lucide-alert-triangle"
        title="Forecast gagal"
        :description="String(runError ?? '')"
      />
      <UAlert
        v-else-if="isSuccess"
        color="success"
        icon="i-lucide-check-circle"
        title="Forecast selesai"
        description="Prediksi terbaru tersedia di bawah."
      />

      <UCard
        v-if="!isPending && data"
        :loading="isPending"
      >
        <template #default>
          <UPageGrid>
            <UPageGrid>
              <div>
                <p class="text-sm text-foreground/60">
                  Lokasi
                </p>
                <p class="font-medium">
                  {{ data.device.location_name ?? '-' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-foreground/60">
                  Status
                </p>
                <p class="font-medium">
                  {{ data.device.active ? 'Aktif' : 'Nonaktif' }}
                </p>
              </div>
            </UPageGrid>
          </UPageGrid>
        </template>
      </UCard>

      <UCard
        v-if="forecast"
        title="Forecast terakhir"
      >
        <template #default>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-foreground/60">
                P50
              </p>
              <p class="text-2xl font-semibold">
                {{ forecast.p50 ?? '-' }} kg
              </p>
            </div>
            <div>
              <p class="text-sm text-foreground/60">
                P80
              </p>
              <p class="text-2xl font-semibold">
                {{ forecast.p80 ?? '-' }} kg
              </p>
            </div>
            <div>
              <p class="text-sm text-foreground/60">
                P90
              </p>
              <p class="text-2xl font-semibold">
                {{ forecast.p90 ?? '-' }} kg
              </p>
            </div>
          </div>
        </template>
      </UCard>

      <UCard
        v-else-if="!isPending && !isError"
        title="Forecast terakhir"
      >
        <template #default>
          <p class="text-foreground/60">
            Belum ada forecast untuk device ini.
          </p>
        </template>
      </UCard>
    </UPageBody>
  </UPage>
</template>
