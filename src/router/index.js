import { createRouter, createWebHistory } from 'vue-router';
import InquiryFormPage from '@/pages/InquiryFormPage.vue';
import AdminDashboardPage from '@/pages/AdminDashboardPage.vue';
import InquiriesListPage from '@/pages/InquiriesListPage.vue';
import RepairJobsListPage from '@/pages/RepairJobsListPage.vue';

const routes = [
  {
    path: '/',
    name: 'inquiry-form',
    component: InquiryFormPage
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardPage
  },
  {
    path: '/admin/inquiries',
    name: 'inquiries-list',
    component: InquiriesListPage
  },
  {
    path: '/admin/repairs',
    name: 'repair-jobs-list',
    component: RepairJobsListPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

