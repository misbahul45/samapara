<script setup lang="ts">
import { computed } from 'vue'
import { DeviceDetailView } from '~/features/devices'

const route = useRoute()
const deviceId = computed(() => String(route.params.id ?? ''))
</script>

<template>
  <DeviceDetailView :device-id="deviceId" />
</template>
