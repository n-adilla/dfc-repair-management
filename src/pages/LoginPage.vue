<template>
  <q-page padding class="flex flex-center bg-grey-2">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section>
        <div class="text-h6">Admin Login</div>
        <div class="text-subtitle2">Sign in to manage inquiries and repairs.</div>
      </q-card-section>
      <q-separator />
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
              label="Login"
              color="primary"
              type="submit"
              :loading="loading"
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
      message: 'Login failed. Check email/password.'
    });
  } finally {
    loading.value = false;
  }
}
</script>

