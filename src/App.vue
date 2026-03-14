<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Repair Management System</q-toolbar-title>
        <q-btn flat label="Public Form" to="/" />
        <q-btn flat label="Admin" to="/admin" />
        <q-space />
        <q-btn
          v-if="!isAuthenticated"
          flat
          dense
          icon="login"
          label="Login"
          to="/login"
        />
        <q-btn
          v-else
          flat
          dense
          icon="logout"
          label="Logout"
          @click="onLogout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { auth, onAuthStateChanged } from '@/firebase';
import { logout } from '@/services/authService';

const router = useRouter();
const $q = useQuasar();
const isAuthenticated = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
  });
});

async function onLogout() {
  try {
    await logout();
    $q.notify({ type: 'positive', message: 'Logged out.' });
    router.push('/');
  } catch (err) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'Failed to logout.' });
  }
}
</script>

