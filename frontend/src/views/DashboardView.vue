<template>
  <v-container>
    <h1 class="text-h5 mb-4">Dashboard</h1>

    <v-row>
      <v-col cols="12" sm="4">
        <v-card color="primary" variant="tonal">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-doctor" size="36" />
            </template>
            <v-card-title class="text-h5">{{ totalDoctors }}</v-card-title>
            <v-card-subtitle>Registered Doctors</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="secondary" variant="tonal">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-account-group" size="36" />
            </template>
            <v-card-title class="text-h5">{{ totalPatients }}</v-card-title>
            <v-card-subtitle>Registered Patients</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" variant="tonal">
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-calendar-check" size="36" />
            </template>
            <v-card-title class="text-h5">{{ totalAppointments }}</v-card-title>
            <v-card-subtitle>Registered Appointments</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Appointments by Status</v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Status</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in byStatus" :key="row.estado">
                  <td>
                    <v-chip :color="statusColor(row.estado)" size="small">{{ statusLabel(row.estado) }}</v-chip>
                  </td>
                  <td class="text-right">{{ row.total }}</td>
                </tr>
                <tr v-if="!loadingStatus && byStatus.length === 0">
                  <td colspan="2" class="text-center text-medium-emphasis">No data</td>
                </tr>
              </tbody>
            </v-table>
            <v-progress-linear v-if="loadingStatus" indeterminate class="mt-2" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Appointments by Doctor</v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in byDoctor" :key="row.Doctor?.id">
                  <td>{{ row.Doctor?.nombre || '—' }}</td>
                  <td>{{ row.Doctor?.especialidad || '—' }}</td>
                  <td class="text-right">{{ row.total }}</td>
                </tr>
                <tr v-if="!loadingDoctor && byDoctor.length === 0">
                  <td colspan="3" class="text-center text-medium-emphasis">No data</td>
                </tr>
              </tbody>
            </v-table>
            <v-progress-linear v-if="loadingDoctor" indeterminate class="mt-2" />
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
import reporteService from '@/services/reporteService';

const totalDoctors = ref(0);
const totalPatients = ref(0);
const totalAppointments = ref(0);
const byStatus = ref([]);
const byDoctor = ref([]);
const loadingStatus = ref(false);
const loadingDoctor = ref(false);

// Status keys come from the backend/database and must stay as-is for matching;
// only the label shown to the user is translated.
const statusColors = {
  pendiente: 'warning',
  confirmada: 'info',
  completada: 'success',
  cancelada: 'error'
};
const statusLabels = {
  pendiente: 'Pending',
  confirmada: 'Confirmed',
  completada: 'Completed',
  cancelada: 'Cancelled'
};
function statusColor(estado) {
  return statusColors[estado] || 'grey';
}
function statusLabel(estado) {
  return statusLabels[estado] || estado;
}

async function loadOverview() {
  try {
    const [doctors, patients, appointments] = await Promise.all([
      doctorService.listar({ limit: 1 }),
      patientService.listar({ limit: 1 }),
      appointmentService.listar({ limit: 1 })
    ]);
    totalDoctors.value = doctors.data.meta.total;
    totalPatients.value = patients.data.meta.total;
    totalAppointments.value = appointments.data.meta.total;
  } catch (e) {
    // Silently ignore: the overview cards will simply show zero
  }
}

async function loadByStatus() {
  loadingStatus.value = true;
  try {
    const { data } = await reporteService.citasPorEstado();
    byStatus.value = data.data;
  } finally {
    loadingStatus.value = false;
  }
}

async function loadByDoctor() {
  loadingDoctor.value = true;
  try {
    const { data } = await reporteService.citasPorDoctor();
    byDoctor.value = data.data;
  } finally {
    loadingDoctor.value = false;
  }
}

onMounted(() => {
  loadOverview();
  loadByStatus();
  loadByDoctor();
});
</script>