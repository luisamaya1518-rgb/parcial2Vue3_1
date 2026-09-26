<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="7">
        <h1 class="text-h5 mb-4">Contacto</h1>
        <v-card>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="onSubmit">
              <v-text-field v-model="form.nombre" label="Nombre" :rules="[required]" />
              <v-text-field v-model="form.email" label="Email" :rules="[required]" />
              <v-textarea v-model="form.mensaje" label="Mensaje" rows="4" :rules="[required]" />
              <v-alert v-if="sent" type="success" density="compact" class="mb-4">
                Mensaje enviado. Te contactaremos pronto.
              </v-alert>
              <v-btn type="submit" color="primary" :loading="sending">
                Enviar mensaje
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-list lines="two" density="comfortable">
          <v-list-item prepend-icon="mdi-map-marker" title="Dirección" subtitle="San Salvador, El Salvador" />
          <v-list-item prepend-icon="mdi-phone" title="Teléfono" subtitle="+503 7000-0000" />
          <v-list-item prepend-icon="mdi-email" title="Email" subtitle="contacto@clinicavue.com" />
          <v-list-item prepend-icon="mdi-clock-outline" title="Horario" subtitle="Lun a Vie, 8:00 - 17:00" />
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';

const formRef = ref(null);
const sending = ref(false);
const sent = ref(false);
const form = reactive({ nombre: '', email: '', mensaje: '' });
const required = (v) => !!v || 'Requerido';

async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  sending.value = true;
  sent.value = false;
  setTimeout(() => {
    sending.value = false;
    sent.value = true;
    Object.assign(form, { nombre: '', email: '', mensaje: '' });
    formRef.value.resetValidation();
  }, 600);
}
</script>
