<template>
  <v-container>
    <h1 class="text-h5 mb-4">Panel de control</h1>

    <v-row>
      <v-col cols="12" sm="4">
        <v-card color="primary" variant="tonal">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-doctor" size="36" />
            </template>
            <v-card-title class="text-h5">{{ totalDoctores }}</v-card-title>
            <v-card-subtitle>Doctores registrados</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="secondary" variant="tonal">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-account-group" size="36" />
            </template>
            <v-card-title class="text-h5">{{ totalPacientes }}</v-card-title>
            <v-card-subtitle>Pacientes registrados</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" variant="tonal">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-calendar-check" size="36" />
            </template>
            <v-card-title class="text-h5">{{ totalCitas }}</v-card-title>
            <v-card-subtitle>Citas registradas</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-card :loading="loading">
          <v-card-title>Citas por estado</v-card-title>
          <v-card-text>
            <v-list v-if="citasPorEstado.length" density="compact">
              <v-list-item v-for="row in citasPorEstado" :key="row.estado">
                <template #prepend>
                  <v-chip :color="estadoColor(row.estado)" size="small" variant="flat" class="mr-2">
                    {{ row.estado }}
                  </v-chip>
                </template>
                <v-list-item-title>{{ row.total }} cita(s)</v-list-item-title>
              </v-list-item>
            </v-list>
            <p v-else class="text-medium-emphasis">Sin datos todavía.</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card :loading="loading">
          <v-card-title>Citas por doctor</v-card-title>
          <v-card-text>
            <v-list v-if="citasPorDoctor.length" density="compact">
              <v-list-item v-for="row in citasPorDoctor" :key="row.Doctor?.id">
                <v-list-item-title>{{ row.Doctor?.nombre }}</v-list-item-title>
                <v-list-item-subtitle>{{ row.Doctor?.especialidad }}</v-list-item-subtitle>
                <template #append>
                  <v-chip color="primary" size="small">{{ row.total }}</v-chip>
                </template>
              </v-list-item>
            </v-list>
            <p v-else class="text-medium-emphasis">Sin datos todavía.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import doctorService from '@/services/doctorService';
import patientService from '@/services/patientService';
import appointmentService from '@/services/appointmentService';
import reportService from '@/services/reportService';

const loading = ref(false);
const totalDoctores = ref(0);
const totalPacientes = ref(0);
const totalCitas = ref(0);
const citasPorEstado = ref([]);
const citasPorDoctor = ref([]);

function estadoColor(estado) {
  return {
    pendiente: 'warning',
    confirmada: 'info',
    completada: 'success',
    cancelada: 'error'
  }[estado] || 'grey';
}

async function loadDashboard() {
  loading.value = true;
  try {
    const [doctores, pacientes, citas, porEstado, porDoctor] = await Promise.all([
      doctorService.listar({ limit: 1 }),
      patientService.listar({ limit: 1 }),
      appointmentService.listar({ limit: 1 }),
      reportService.citasPorEstado(),
      reportService.citasPorDoctor()
    ]);
    totalDoctores.value = doctores.data.meta.total;
    totalPacientes.value = pacientes.data.meta.total;
    totalCitas.value = citas.data.meta.total;
    citasPorEstado.value = porEstado.data.data;
    citasPorDoctor.value = porDoctor.data.data;
  } catch (e) {
    // Silenciar: el panel simplemente mostrará valores en cero
  } finally {
    loading.value = false;
  }
}

onMounted(loadDashboard);
</script>
