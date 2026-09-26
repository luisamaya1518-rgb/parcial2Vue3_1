<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <v-icon icon="mdi-stethoscope" size="64" color="primary" class="mb-4" />
        <h1 class="text-h3 font-weight-bold mb-2">Sistema de Gestión Médica</h1>
        <p class="text-body-1 text-medium-emphasis mb-6">
          Administra doctores, pacientes y citas de tu clínica en un solo lugar.
        </p>
        <v-btn
          v-if="!auth.isAuthenticated"
          color="primary"
          size="large"
          to="/login"
          class="mr-2"
        >
          Iniciar sesión
        </v-btn>
        <v-btn
          v-if="!auth.isAuthenticated"
          variant="outlined"
          size="large"
          to="/register"
        >
          Crear cuenta
        </v-btn>
        <v-btn
          v-else
          color="primary"
          size="large"
          to="/dashboard"
        >
          Ir al panel
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-8" justify="center">
      <v-col v-for="card in cards" :key="card.title" cols="12" sm="6" md="4">
        <v-card variant="outlined" class="h-100 pa-2">
          <v-card-item>
            <template #prepend>
              <v-avatar color="primary" variant="tonal" size="48">
                <v-icon :icon="card.icon" />
              </v-avatar>
            </template>
            <v-card-title>{{ card.title }}</v-card-title>
          </v-card-item>
          <v-card-text>{{ card.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const cards = [
  {
    title: 'Doctores',
    icon: 'mdi-doctor',
    text: 'Registra al personal médico junto con su especialidad y datos de contacto.'
  },
  {
    title: 'Pacientes',
    icon: 'mdi-account-group',
    text: 'Lleva el historial y los datos de contacto de cada paciente.'
  },
  {
    title: 'Citas',
    icon: 'mdi-calendar-check',
    text: 'Agenda, edita y da seguimiento al estado de cada cita médica.'
  }
];
</script>
