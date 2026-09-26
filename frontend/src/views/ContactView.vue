<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card>
          <v-card-title>Contact Us</v-card-title>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                label="Your email"
                type="email"
                :rules="[required, validEmail]"
              />
              <v-textarea
                v-model="message"
                label="Message"
                :rules="[required]"
                rows="4"
                counter="1000"
                maxlength="1000"
              />

              <v-alert v-if="error" type="error" density="compact" class="mb-2">
                {{ error }}
              </v-alert>
              <v-alert v-if="sent" type="success" density="compact" class="mb-2">
                Message sent successfully. We'll get back to you soon.
              </v-alert>

              <v-btn type="submit" color="primary" block :loading="loading">
                Send
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
const message = ref('');
const error = ref('');
const sent = ref(false);
const loading = ref(false);
const formRef = ref(null);

const required = (v) => !!v || 'Required';
const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v) || 'Invalid email';

async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  error.value = '';
  sent.value = false;
  loading.value = true;
  try {
    await api.post('/contact', { email: email.value, message: message.value });
    sent.value = true;
    email.value = '';
    message.value = '';
    formRef.value.resetValidation();
  } catch (e) {
    error.value = e.response?.data?.message || 'Error sending message';
  } finally {
    loading.value = false;
  }
}
</script>