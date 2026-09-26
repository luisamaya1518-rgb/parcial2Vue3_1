<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" class="text-center">
        <v-icon icon="mdi-hospital-box" size="80" color="primary" class="mb-4" />

        <h1 class="text-h3 font-weight-bold mb-2">
          Sistema de Gestión Médica
        </h1>
        <p class="text-h6 text-medium-emphasis mb-8">
          Administra pacientes, doctores y citas en un solo lugar.
        </p>

        <v-row justify="center" class="mb-8">
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="primary">
              <v-card-text class="text-center">
                <v-icon icon="mdi-account-injury" size="40" class="mb-2" />
                <div class="text-h6">Pacientes</div>
                <div class="text-body-2">Gestiona el historial médico de cada paciente</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="primary">
              <v-card-text class="text-center">
                <v-icon icon="mdi-doctor" size="40" class="mb-2" />
                <div class="text-h6">Doctores</div>
                <div class="text-body-2">Administra especialistas y sus especialidades</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="primary">
              <v-card-text class="text-center">
                <v-icon icon="mdi-calendar-check" size="40" class="mb-2" />
                <div class="text-h6">Citas</div>
                <div class="text-body-2">Agenda y controla las citas médicas</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <template v-if="auth.isAuthenticated">
          <v-btn color="primary" size="large" to="/dashboard" prepend-icon="mdi-view-dashboard">
            Ir al Dashboard
          </v-btn>
        </template>
        <template v-else>
          <v-btn color="primary" size="large" to="/login" class="mr-3">
            Iniciar sesión
          </v-btn>
          <v-btn color="primary" variant="outlined" size="large" to="/register">
            Crear cuenta
          </v-btn>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
</script>