<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card>
          <v-card-title>Create Account</v-card-title>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="onSubmit">
              <v-text-field
                v-model="name"
                label="Full Name"
                :rules="[required]"
              />
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[required, validEmail]"
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="[required, strongPassword]"
                hint="At least 8 characters, with letters and numbers"
                persistent-hint
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                class="mt-2"
                :rules="[required, passwordsMatch]"
              />

              <v-alert v-if="error" type="error" density="compact" class="mt-4 mb-2">
                {{ error }}
              </v-alert>

              <v-btn type="submit" color="primary" block class="mt-4" :loading="loading">
                Sign Up
              </v-btn>
            </v-form>

            <div class="text-center mt-4">
              Already have an account?
              <RouterLink to="/login">Log in</RouterLink>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);
const formRef = ref(null);

const router = useRouter();
const auth = useAuthStore();

const required = (v) => !!v || 'Required';
const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v) || 'Invalid email';
const strongPassword = (v) =>
  (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)) ||
  'Must be 8+ characters, with letters and numbers';
const passwordsMatch = (v) => v === password.value || 'Passwords do not match';

async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  error.value = '';
  loading.value = true;
  try {
    await auth.register(name.value, email.value, password.value);
    router.push('/dashboard');
  } catch (e) {
    error.value = e.response?.data?.message || 'Error creating account';
  } finally {
    loading.value = false;
  }
}
</script>