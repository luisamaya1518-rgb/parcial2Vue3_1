<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card>
          <v-card-title>Contáctanos</v-card-title>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                label="Tu correo"
                type="email"
                :rules="[required, emailValido]"
              />
              <v-textarea
                v-model="mensaje"
                label="Mensaje"
                :rules="[required]"
                rows="4"
                counter="1000"
                maxlength="1000"
              />

              <v-alert v-if="error" type="error" density="compact" class="mb-2">
                {{ error }}
              </v-alert>
              <v-alert v-if="enviado" type="success" density="compact" class="mb-2">
                Mensaje enviado correctamente. Te responderemos pronto.
              </v-alert>

              <v-btn type="submit" color="primary" block :loading="loading">
                Enviar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const email = ref('');
const mensaje = ref('');
const error = ref('');
const enviado = ref(false);
const loading = ref(false);
const formRef = ref(null);

const required = (v) => !!v || 'Requerido';
const emailValido = (v) => /^\S+@\S+\.\S+$/.test(v) || 'Email inválido';

async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  error.value = '';
  enviado.value = false;
  loading.value = true;
  try {
    await api.post('/contact', { email: email.value, mensaje: mensaje.value });
    enviado.value = true;
    email.value = '';
    mensaje.value = '';
    formRef.value.resetValidation();
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al enviar el mensaje';
  } finally {
    loading.value = false;
  }
}
</script>