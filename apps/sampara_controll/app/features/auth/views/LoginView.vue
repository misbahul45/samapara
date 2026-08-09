<script setup lang="ts">
import { ref } from 'vue'
import { useAuthSession } from '../composables/useAuthSession'

const email = ref('operator@samapara.local')
const password = ref('samapara-demo')
const errorMessage = ref('')
const isSubmitting = ref(false)
const { user, login, logout } = useAuthSession()

async function submit() {
  errorMessage.value = ''

  if (!email.value.includes('@')) {
    errorMessage.value = 'Masukkan alamat email yang valid.'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password minimal 8 karakter.'
    return
  }

  isSubmitting.value = true

  try {
    await login({ email: email.value, password: password.value })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UContainer class="py-16">
    <UCard class="mx-auto max-w-md">
      <template #header>
        <div>
          <h1 class="text-xl font-semibold">
            {{ user ? 'Session aktif' : 'Masuk ke Samapara' }}
          </h1>
          <p class="mt-1 text-sm text-muted">
            {{ user ? 'Session demo tersimpan melalui shared cookie state.' : 'Contoh vertical slice auth berbasis feature-first.' }}
          </p>
        </div>
      </template>

      <div
        v-if="user"
        class="space-y-4"
      >
        <UAlert
          color="success"
          icon="i-lucide-circle-check"
          title="Login berhasil"
          :description="`${user.name} (${user.email})`"
        />
        <UButton
          label="Keluar"
          color="neutral"
          variant="outline"
          block
          @click="logout"
        />
      </div>

      <form
        v-else
        class="space-y-4"
        @submit.prevent="submit"
      >
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="errorMessage"
          color="error"
          icon="i-lucide-triangle-alert"
          title="Login gagal"
          :description="errorMessage"
        />

        <UButton
          type="submit"
          label="Masuk"
          :loading="isSubmitting"
          block
        />

        <p class="text-center text-xs text-muted">
          Mode demo lokal menerima email valid dan password minimal 8 karakter.
        </p>
      </form>
    </UCard>
  </UContainer>
</template>
