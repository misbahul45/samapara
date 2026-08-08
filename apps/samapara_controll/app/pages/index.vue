<script setup lang="ts">
import { computed } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { useDevicesQuery } from '~/queries/useDevicesQuery'

const { data, isPending, isError, error, refetch } = useDevicesQuery()

interface DeviceRow {
  id: string
  name: string
  serial_number: string
  location_name: string
  active: string
  created_at: string
}

const columns: ColumnDef<DeviceRow, unknown>[] = [
  { id: 'name', accessorFn: row => row.name, header: 'Nama' },
  { id: 'serial_number', accessorFn: row => row.serial_number, header: 'Serial' },
  { id: 'location_name', accessorFn: row => row.location_name, header: 'Lokasi' },
  { id: 'active', accessorFn: row => row.active, header: 'Status' },
  { id: 'created_at', accessorFn: row => row.created_at, header: 'Dibuat' }
]

const rows = computed<DeviceRow[]>(() =>
  (data.value?.devices ?? []).map(device => ({
    id: device.id,
    name: device.name,
    serial_number: device.serial_number,
    location_name: device.location_name ?? '-',
    active: device.active ? 'Aktif' : 'Nonaktif',
    created_at: new Date(device.created_at).toLocaleString('id-ID')
  }))
)
</script>

<template>
  <UPage>
    <UPageHeader
      title="Devices"
      description="Daftar container pintar dari telemetry SAMAPARA"
    >
      <template #links>
        <UButton
          icon="i-lucide-refresh-cw"
          label="Muat ulang"
          color="neutral"
          variant="outline"
          :loading="isPending"
          @click="() => refetch()"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <UAlert
        v-if="isError"
        color="error"
        icon="i-lucide-alert-triangle"
        title="Gagal memuat devices"
        :description="String(error ?? '')"
      />

      <UTable
        v-else
        :data="rows"
        :columns="columns"
        :loading="isPending"
        :empty-state="{ icon: 'i-lucide-box', label: 'Belum ada device' }"
      >
        <template #name-cell="{ row }">
          <div class="font-medium">
            {{ row.original.name }}
          </div>
        </template>
      </UTable>
    </UPageBody>
  </UPage>
</template>
