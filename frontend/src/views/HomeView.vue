<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" class="text-center">
        <v-icon icon="mdi-hospital-box" size="80" color="primary" class="mb-4" />

        <h1 class="text-h3 font-weight-bold mb-2">
          Medical Management System
        </h1>
        <p class="text-h6 text-medium-emphasis mb-8">
          Manage patients, doctors, and appointments all in one place.
        </p>

        <v-row justify="center" class="mb-8">
          <v-col v-for="card in cards" :key="card.title" cols="12" sm="4">
            <v-card variant="tonal" color="primary">
              <v-card-text class="text-center">
                <v-icon :icon="card.icon" size="40" class="mb-2" />
                <div class="text-h6">{{ card.title }}</div>
                <div class="text-body-2">{{ card.text }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <template v-if="auth.isAuthenticated">
          <v-btn color="primary" size="large" to="/dashboard" prepend-icon="mdi-view-dashboard">
            Go to Dashboard
          </v-btn>
        </template>
        <template v-else>
          <v-btn color="primary" size="large" to="/login" class="mr-3">
            Log In
          </v-btn>
          <v-btn color="primary" variant="outlined" size="large" to="/register">
            Create Account
          </v-btn>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const cards = [
  {
    title: 'Patients',
    icon: 'mdi-account-injury',
    text: 'Manage each patient\'s medical history and contact details.'
  },
  {
    title: 'Doctors',
    icon: 'mdi-doctor',
    text: 'Manage specialists along with their specialties and contact information.'
  },
  {
    title: 'Appointments',
    icon: 'mdi-calendar-check',
    text: 'Schedule, edit, and track the status of each medical appointment.'
  }
];
</script>