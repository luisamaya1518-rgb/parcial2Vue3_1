<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Iniciar sesión</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[v => !!v || 'Requerido']"
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                :rules="[v => !!v || 'Requerido']"
              />
              <v-alert v-if="error" type="error" density="compact" class="mb-4">
                {{ error }}
              </v-alert>
              <v-btn type="submit" color="primary" block :loading="loading">
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();
const auth = useAuthStore();

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push('/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
}
</script>