<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>
        <RouterLink to="/" class="text-white text-decoration-none">
          Gestión Médica
        </RouterLink>
      </v-app-bar-title>

      <template v-if="auth.isAuthenticated">
        <v-btn to="/dashboard" variant="text">Dashboard</v-btn>
        <v-btn to="/patients" variant="text">Pacientes</v-btn>
        <v-btn to="/doctors" variant="text">Doctores</v-btn>
        <v-btn to="/appointments" variant="text">Citas</v-btn>
        <v-btn to="/contact" variant="text">Contacto</v-btn>
        <v-btn variant="text" @click="onLogout">
          Salir ({{ auth.user?.nombre }})
        </v-btn>
      </template>

      <template v-else>
        <v-btn to="/" variant="text">Inicio</v-btn>
        <v-btn to="/contact" variant="text">Contacto</v-btn>
        <v-btn to="/login" variant="text">Iniciar sesión</v-btn>
        <v-btn to="/register" variant="outlined" class="ml-2">Registrarse</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function onLogout() {
  await auth.logout();
  router.push('/login');
}
</script>