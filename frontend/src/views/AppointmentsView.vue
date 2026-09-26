<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h1 class="text-h5">Citas</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
          Nueva cita
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-2">
      <v-col cols="12" sm="4">
        <v-select
          v-model="filterEstado"
          :items="estados"
          label="Filtrar por estado"
          density="compact"
          clearable
          @update:model-value="fetchCitas"
        />
      </v-col>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="citas"
      :items-length="total"
      :loading="loading"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      @update:options="fetchCitas"
    >
      <template #item.paciente="{ item }">
        {{ item.Paciente?.nombre }}
      </template>
      <template #item.doctor="{ item }">
        {{ item.Doctor?.nombre }}
      </template>
      <template #item.fecha_cita="{ item }">
        {{ formatFecha(item.fecha_cita) }}
      </template>
      <template #item.estado="{ item }">
        <v-chip :color="estadoColor(item.estado)" size="small" variant="flat">
          {{ item.estado }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-icon size="small" class="mr-2" @click="openEdit(item)">mdi-pencil</v-icon>
        <v-icon size="small" color="error" @click="confirmDelete(item)">mdi-delete</v-icon>
      </template>
    </v-data-table-server>

    <!-- Dialogo crear/editar -->
    <v-dialog v-model="dialog" max-width="520">
      <v-card>
        <v-card-title>{{ editing ? 'Editar cita' : 'Nueva cita' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-select
              v-model="form.paciente_id"
              :items="pacientes"
              item-title="nombre"
              item-value="id"
              label="Paciente"
              :rules="[required]"
            />
            <v-select
              v-model="form.doctor_id"
              :items="doctores"
              item-title="nombre"
              item-value="id"
              label="Doctor"
              :rules="[required]"
            />
            <v-text-field
              v-model="form.fecha_cita"
              label="Fecha y hora"
              type="datetime-local"
              :rules="[required]"
            />
            <v-select
              v-model="form.estado"
              :items="estados"
              label="Estado"
            />
            <v-textarea v-model="form.notas" label="Notas" rows="2" />
            <v-alert v-if="formError" type="error" density="compact" class="mb-2">
              {{ formError }}
            </v-alert>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmar eliminar -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Eliminar cita</v-card-title>
        <v-card-text>¿Seguro que quieres eliminar esta cita?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" :loading="deleting" @click="remove">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import appointmentService from '@/services/appointmentService';
import doctorService from '@/services/doctorService';
import patientService from '@/services/patientService';

const headers = [
  { title: 'Paciente', key: 'paciente', sortable: false },
  { title: 'Doctor', key: 'doctor', sortable: false },
  { title: 'Fecha', key: 'fecha_cita' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
];

const estados = ['pendiente', 'confirmada', 'completada', 'cancelada'];

const citas = ref([]);
const total = ref(0);
const page = ref(1);
const itemsPerPage = ref(10);
const loading = ref(false);
const filterEstado = ref(null);

const doctores = ref([]);
const pacientes = ref([]);

const dialog = ref(false);
const editing = ref(false);
const saving = ref(false);
const formRef = ref(null);
const formError = ref('');
const form = reactive({
  id: null,
  paciente_id: null,
  doctor_id: null,
  fecha_cita: '',
  estado: 'pendiente',
  notas: ''
});

const deleteDialog = ref(false);
const deleting = ref(false);
const toDelete = ref(null);

const snackbar = reactive({ show: false, text: '', color: 'success' });
const required = (v) => !!v || 'Requerido';

function estadoColor(estado) {
  return {
    pendiente: 'warning',
    confirmada: 'info',
    completada: 'success',
    cancelada: 'error'
  }[estado] || 'grey';
}

function formatFecha(value) {
  if (!value) return '';
  return new Date(value).toLocaleString();
}

async function fetchCitas() {
  loading.value = true;
  try {
    const { data } = await appointmentService.listar({
      page: page.value,
      limit: itemsPerPage.value,
      estado: filterEstado.value || undefined
    });
    citas.value = data.data;
    total.value = data.meta.total;
  } catch (e) {
    notify('Error al cargar citas', 'error');
  } finally {
    loading.value = false;
  }
}

async function loadOptions() {
  try {
    const [{ data: dData }, { data: pData }] = await Promise.all([
      doctorService.listar({ limit: 50 }),
      patientService.listar({ limit: 50 })
    ]);
    doctores.value = dData.data;
    pacientes.value = pData.data;
  } catch (e) {
    notify('Error al cargar doctores/pacientes', 'error');
  }
}

function openCreate() {
  editing.value = false;
  formError.value = '';
  Object.assign(form, {
    id: null,
    paciente_id: null,
    doctor_id: null,
    fecha_cita: '',
    estado: 'pendiente',
    notas: ''
  });
  dialog.value = true;
}

function openEdit(item) {
  editing.value = true;
  formError.value = '';
  Object.assign(form, {
    id: item.id,
    paciente_id: item.paciente_id,
    doctor_id: item.doctor_id,
    fecha_cita: item.fecha_cita?.slice(0, 16),
    estado: item.estado,
    notas: item.notas
  });
  dialog.value = true;
}

async function save() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  saving.value = true;
  formError.value = '';
  try {
    if (editing.value) {
      await appointmentService.actualizar(form.id, form);
      notify('Cita actualizada');
    } else {
      await appointmentService.crear(form);
      notify('Cita creada');
    }
    dialog.value = false;
    fetchCitas();
  } catch (e) {
    formError.value = e.response?.data?.message || 'Error al guardar';
  } finally {
    saving.value = false;
  }
}

function confirmDelete(item) {
  toDelete.value = item;
  deleteDialog.value = true;
}

async function remove() {
  deleting.value = true;
  try {
    await appointmentService.eliminar(toDelete.value.id);
    notify('Cita eliminada');
    deleteDialog.value = false;
    fetchCitas();
  } catch (e) {
    notify(e.response?.data?.message || 'No se pudo eliminar', 'error');
    deleteDialog.value = false;
  } finally {
    deleting.value = false;
  }
}

function notify(text, color = 'success') {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
}

onMounted(loadOptions);
</script>
