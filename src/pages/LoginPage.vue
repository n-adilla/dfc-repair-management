<template>
  <q-page class="flex flex-center login-page">
    <q-card class="login-card" flat>
      <q-card-section class="q-pb-none">
        <div class="text-h6 text-weight-medium text-primary">Admin sign in</div>
        <div class="text-body2 text-grey-7">
          Sign in to manage repair inquiries and jobs.
        </div>
      </q-card-section>
      <q-separator class="q-my-md" />
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            dense
            required
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            dense
            required
          />
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Sign in"
              color="primary"
              type="submit"
              :loading="loading"
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { login } from '@/services/authService';

const router = useRouter();
const $q = useQuasar();

const email = ref('');
const password = ref('');
const loading = ref(false);

async function onSubmit() {
  try {
    loading.value = true;
    await login(email.value, password.value);
    $q.notify({ type: 'positive', message: 'Logged in successfully.' });
    router.push('/admin');
  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: 'Login failed. Check email and password.'
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Page Background */
.login-page {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 1rem;
}

/* Card Styling */
.login-card {
  width: 100%;
  max-width: 400px; /* desktop max width */
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Responsive Text & Spacing */
@media (max-width: 480px) {
  .login-card {
    padding: 1rem;
  }
  .text-h6 {
    font-size: 1.2rem;
  }
  .text-body2 {
    font-size: 0.85rem;
  }
}
</style>
