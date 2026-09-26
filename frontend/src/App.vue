<template>
  <v-app>
    <v-navigation-drawer
      v-if="auth.isAuthenticated"
      v-model="drawer"
      temporary
    >
      <v-list nav density="compact">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>

      <template #append>
        <v-list nav density="compact">
          <v-list-item
            prepend-icon="mdi-logout"
            :title="`Cerrar sesión (${auth.user?.nombre})`"
            @click="handleLogout"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar color="primary" density="comfortable" flat>
      <v-app-bar-nav-icon
        v-if="auth.isAuthenticated"
        @click="drawer = !drawer"
      />
      <v-app-bar-title>
        <router-link to="/" class="app-title-link">
          <v-icon icon="mdi-stethoscope" class="mr-2" />
          Gestión Médica
        </router-link>
      </v-app-bar-title>

      <v-spacer />

      <template v-if="auth.isAuthenticated">
        <v-btn
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          variant="text"
          class="d-none d-md-inline-flex"
        >
          {{ item.title }}
        </v-btn>
        <v-btn
          variant="text"
          prepend-icon="mdi-logout"
          class="d-none d-md-inline-flex"
          @click="handleLogout"
        >
          Salir ({{ auth.user?.nombre }})
        </v-btn>
      </template>
      <template v-else>
        <v-btn to="/" variant="text">Inicio</v-btn>
        <v-btn to="/contact" variant="text">Contacto</v-btn>
        <v-btn to="/login" variant="text">Iniciar sesión</v-btn>
        <v-btn to="/register" variant="flat" color="secondary" class="ml-2">
          Registrarse
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer color="primary" class="justify-center text-caption">
      ULS &copy; {{ year }} — Sistema de gestión médica
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const drawer = ref(false);
const year = computed(() => new Date().getFullYear());

const navItems = [
  { title: 'Panel', to: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Doctores', to: '/doctors', icon: 'mdi-doctor' },
  { title: 'Pacientes', to: '/patients', icon: 'mdi-account-group' },
  { title: 'Citas', to: '/appointments', icon: 'mdi-calendar-check' }
];

async function handleLogout() {
  await auth.logout();
  router.push('/login');
}
</script>

<style scoped>
.app-title-link {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
</style>