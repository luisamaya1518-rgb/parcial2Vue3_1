<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
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
                :rules="[required, emailValido]"
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                :rules="[required, passwordFuerte]"
                hint="Mínimo 8 caracteres, con letras y números"
                persistent-hint
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                class="mt-2"
                :rules="[required, confirmaCoincide]"
              />

              <v-alert v-if="error" type="error" density="compact" class="mt-4 mb-2">
                {{ error }}
              </v-alert>

              <v-btn type="submit" color="primary" block class="mt-4" :loading="loading">
                Registrarse
              </v-btn>
            </v-form>

            <div class="text-center mt-4">
              ¿Ya tienes cuenta?
              <RouterLink to="/login">Inicia sesión</RouterLink>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const nombre = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);
const formRef = ref(null);

const router = useRouter();
const auth = useAuthStore();

const required = (v) => !!v || 'Requerido';
const emailValido = (v) => /^\S+@\S+\.\S+$/.test(v) || 'Email inválido';
const passwordFuerte = (v) =>
  (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)) ||
  'Debe tener 8+ caracteres, con letras y números';
const confirmaCoincide = (v) => v === password.value || 'Las contraseñas no coinciden';

async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  error.value = '';
  loading.value = true;
  try {
    await auth.register(nombre.value, email.value, password.value);
    router.push('/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al registrarse';
  } finally {
    loading.value = false;
  }
}
</script>