<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col cols="auto">
        <h1 class="text-h5">Pacientes</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
          Nuevo paciente
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field
      v-model="search"
      label="Buscar por nombre"
      prepend-inner-icon="mdi-magnify"
      density="compact"
      class="mb-4"
      clearable
      @update:model-value="debouncedSearch"
    />

    <v-data-table-server
      :headers="headers"
      :items="pacientes"
      :items-length="total"
      :loading="loading"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      @update:options="fetchPacientes"
    >
      <template #item.actions="{ item }">
        <v-icon size="small" class="mr-2" @click="openEdit(item)">mdi-pencil</v-icon>
        <v-icon size="small" color="error" @click="confirmDelete(item)">mdi-delete</v-icon>
      </template>
    </v-data-table-server>

    <!-- Dialogo crear/editar -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ editing ? 'Editar paciente' : 'Nuevo paciente' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="save">
            <v-text-field v-model="form.nombre" label="Nombre" :rules="[required]" />
            <v-text-field v-model="form.email" label="Email" :rules="[required]" />
            <v-text-field v-model="form.telefono" label="Teléfono" />
            <v-text-field
              v-model="form.fecha_nacimiento"
              label="Fecha de nacimiento"
              type="date"
              :rules="[required]"
            />
            <v-textarea v-model="form.historial_medico" label="Historial médico" rows="2" />
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
        <v-card-title>Eliminar paciente</v-card-title>
        <v-card-text>
          ¿Seguro que quieres eliminar a <strong>{{ toDelete?.nombre }}</strong>?
        </v-card-text>
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
import { ref, reactive } from 'vue';
import patientService from '@/services/patientService';

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Email', key: 'email' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Fecha de nacimiento', key: 'fecha_nacimiento' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
];

const pacientes = ref([]);
const total = ref(0);
const page = ref(1);
const itemsPerPage = ref(10);
const loading = ref(false);
const search = ref('');

const dialog = ref(false);
const editing = ref(false);
const saving = ref(false);
const formRef = ref(null);
const formError = ref('');
const form = reactive({
  id: null,
  nombre: '',
  email: '',
  telefono: '',
  fecha_nacimiento: '',
  historial_medico: ''
});

const deleteDialog = ref(false);
const deleting = ref(false);
const toDelete = ref(null);

const snackbar = reactive({ show: false, text: '', color: 'success' });
const required = (v) => !!v || 'Requerido';

let searchTimeout = null;
function debouncedSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchPacientes(), 400);
}

async function fetchPacientes() {
  loading.value = true;
  try {
    const { data } = await patientService.listar({
      page: page.value,
      limit: itemsPerPage.value,
      search: search.value || undefined
    });
    pacientes.value = data.data;
    total.value = data.meta.total;
  } catch (e) {
    notify('Error al cargar pacientes', 'error');
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = false;
  formError.value = '';
  Object.assign(form, {
    id: null,
    nombre: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    historial_medico: ''
  });
  dialog.value = true;
}

function openEdit(item) {
  editing.value = true;
  formError.value = '';
  Object.assign(form, item);
  dialog.value = true;
}

async function save() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  saving.value = true;
  formError.value = '';
  try {
    if (editing.value) {
      await patientService.actualizar(form.id, form);
      notify('Paciente actualizado');
    } else {
      await patientService.crear(form);
      notify('Paciente creado');
    }
    dialog.value = false;
    fetchPacientes();
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
    await patientService.eliminar(toDelete.value.id);
    notify('Paciente eliminado');
    deleteDialog.value = false;
    fetchPacientes();
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
</script>
