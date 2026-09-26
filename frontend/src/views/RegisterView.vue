<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Crear cuenta</v-card-title>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="onSubmit">
              <v-text-field
                v-model="nombre"
                label="Nombre completo"
                :rules="[required]"
              />
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[required]"
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                hint="Mínimo 8 caracteres, con letras y números"
                :rules="[required]"
              />
              <v-alert v-if="error" type="error" density="compact" class="mb-4">
                {{ error }}
              </v-alert>
              <v-btn type="submit" color="primary" block :loading="loading">
                Registrarme
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <span class="text-body-2">¿Ya tienes cuenta?</span>
            <v-btn variant="text" size="small" to="/login">Inicia sesión</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const nombre = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const formRef = ref(null);
const router = useRouter();
const auth = useAuthStore();

const required = (v) => !!v || 'Requerido';

async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  error.value = '';
  loading.value = true;
  try {
    await auth.register(nombre.value, email.value, password.value);
    router.push('/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al registrar la cuenta';
  } finally {
    loading.value = false;
  }
}
</script>
