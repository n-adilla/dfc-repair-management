import { createRouter, createWebHistory } from 'vue-router';
import InquiryFormPage from '@/pages/InquiryFormPage.vue';
import AdminDashboardPage from '@/pages/AdminDashboardPage.vue';
import InquiriesListPage from '@/pages/InquiriesListPage.vue';
import RepairJobsListPage from '@/pages/RepairJobsListPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import { getCurrentUser } from '@/services/authService';

const routes = [
  {
    path: '/',
    name: 'inquiry-form',
    component: InquiryFormPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/inquiries',
    name: 'inquiries-list',
    component: InquiriesListPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/repairs',
    name: 'repair-jobs-list',
    component: RepairJobsListPage,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !getCurrentUser()) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;

