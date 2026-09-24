<template>
  <v-container>
    <h1 class="text-h5 mb-4">Dashboard</h1>

    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="card in resumenCards" :key="card.estado">
        <v-card :color="card.color" variant="tonal">
          <v-card-text class="text-center">
            <div class="text-h3 font-weight-bold">{{ card.total }}</div>
            <div class="text-capitalize">{{ card.estado }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Citas por estado</v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in porEstado" :key="row.estado">
                  <td class="text-capitalize">
                    <v-chip :color="colorEstado(row.estado)" size="small">{{ row.estado }}</v-chip>
                  </td>
                  <td class="text-right">{{ row.total }}</td>
                </tr>
                <tr v-if="!loadingEstado && porEstado.length === 0">
                  <td colspan="2" class="text-center text-medium-emphasis">Sin datos</td>
                </tr>
              </tbody>
            </v-table>
            <v-progress-linear v-if="loadingEstado" indeterminate class="mt-2" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Citas por doctor</v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Especialidad</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in porDoctor" :key="row.Doctor?.id">
                  <td>{{ row.Doctor?.nombre || '—' }}</td>
                  <td>{{ row.Doctor?.especialidad || '—' }}</td>
                  <td class="text-right">{{ row.total }}</td>
                </tr>
                <tr v-if="!loadingDoctor && porDoctor.length === 0">
                  <td colspan="3" class="text-center text-medium-emphasis">Sin datos</td>
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
import { ref, computed, onMounted } from 'vue';
import reporteService from '@/services/reporteService';

const porEstado = ref([]);
const porDoctor = ref([]);
const loadingEstado = ref(false);
const loadingDoctor = ref(false);

const estadosBase = ['pendiente', 'confirmada', 'completada', 'cancelada'];
const coloresEstado = {
  pendiente: 'warning',
  confirmada: 'info',
  completada: 'success',
  cancelada: 'error'
};
function colorEstado(estado) {
  return coloresEstado[estado] || 'grey';
}

// Asegura que las 4 tarjetas siempre aparezcan, aunque un estado tenga 0 citas
const resumenCards = computed(() =>
  estadosBase.map((estado) => {
    const encontrado = porEstado.value.find((r) => r.estado === estado);
    return {
      estado,
      total: encontrado ? Number(encontrado.total) : 0,
      color: coloresEstado[estado]
    };
  })
);

async function cargarPorEstado() {
  loadingEstado.value = true;
  try {
    const { data } = await reporteService.citasPorEstado();
    porEstado.value = data.data;
  } finally {
    loadingEstado.value = false;
  }
}

async function cargarPorDoctor() {
  loadingDoctor.value = true;
  try {
    const { data } = await reporteService.citasPorDoctor();
    porDoctor.value = data.data;
  } finally {
    loadingDoctor.value = false;
  }
}

onMounted(() => {
  cargarPorEstado();
  cargarPorDoctor();
});
</script>