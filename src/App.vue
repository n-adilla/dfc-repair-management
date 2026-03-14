<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="header-service">
      <q-toolbar>

        <!-- Logo / Title -->
        <q-toolbar-title class="text-weight-medium">
          <q-icon name="camera_alt" size="sm" class="q-mr-sm" />
          Digital Fix Care
        </q-toolbar-title>

        <!-- Toolbar Buttons (hidden on mobile) -->
        <div class="desktop-menu">
          <q-btn v-if="!isAuthenticated" flat label="Service enquiry form" to="/" />
          <template v-else>
            <q-btn flat label="Dashboard" to="/admin" />
            <q-btn flat label="Inquiries" to="/admin/inquiries" />
            <q-btn flat label="Repairs" to="/admin/repairs" />
          </template>
        </div>

        <q-space />

        <!-- Logout Button -->
        <q-btn
          v-if="isAuthenticated"
          flat
          dense
          icon="logout"
          label="Logout"
          @click="onLogout"
        />

      </q-toolbar>
    </q-header>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer v-if="showFooter" elevated class="footer-service">
      <q-toolbar>
        <q-toolbar-title class="text-caption">
          © {{ new Date().getFullYear() }} Digital Fix Care | Camera service & repairs
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { auth, onAuthStateChanged } from '@/firebase';
import { logout } from '@/services/authService';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const isAuthenticated = ref(false);

const showFooter = computed(() => {
  return !route.path.startsWith('/admin') && route.path !== '/login';
});

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

<style scoped>
/* Header & Footer Colors */
.header-service {
  background: linear-gradient(135deg, #0d47a1 0%, #1565c0 100%);
}
.footer-service {
  background: #0d47a1;
  color: rgba(255, 255, 255, 0.9);
}

/* Hide toolbar buttons on mobile */
.desktop-menu {
  display: flex;
}
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
  .q-toolbar-title {
    font-size: 1rem;
  }
}
</style>
