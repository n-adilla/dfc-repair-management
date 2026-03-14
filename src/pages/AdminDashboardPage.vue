<template>
  <q-page padding class="admin-page">
    <!-- Dashboard Cards -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4 q-mb-md">
        <q-card flat class="admin-card">
          <q-card-section>
            <div class="text-h6 text-primary">New inquiries</div>
            <div class="text-subtitle2">Total customer inquiries</div>
          </q-card-section>
          <q-card-section>
            <div class="text-h4">{{ newInquiries }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" label="View" to="/admin/inquiries" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4 q-mb-md">
        <q-card flat class="admin-card">
          <q-card-section>
            <div class="text-h6 text-primary">Active repairs</div>
            <div class="text-subtitle2">In progress or pending</div>
          </q-card-section>
          <q-card-section>
            <div class="text-h4">{{ activeRepairs }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" label="View" to="/admin/repairs" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4 q-mb-md">
        <q-card flat class="admin-card">
          <q-card-section>
            <div class="text-h6 text-primary">Completed repairs</div>
            <div class="text-subtitle2">Finished repair jobs</div>
          </q-card-section>
          <q-card-section>
            <div class="text-h4">{{ completedRepairs }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" label="View" to="/admin/repairs" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="q-mt-lg">
      <q-card flat class="admin-card">
        <q-card-section>
          <div class="text-h6 text-primary">Recent activity</div>
          <div class="text-subtitle2">
            Latest inquiries and repair job updates
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="recent-activity-list">
          <q-list>
            <q-item v-for="item in recentActivity" :key="item.id">
              <q-item-section avatar>
                <q-icon :name="item.icon" :color="item.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.title }}</q-item-label>
                <q-item-label caption>{{ item.subtitle }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!recentActivity.length">
              <q-item-section>
                <q-item-label caption>No recent activity.</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getInquiries } from '@/services/inquiriesService';
import { listRepairJobs } from '@/services/repairJobsService';

const newInquiries = ref(0);
const activeRepairs = ref(0);
const completedRepairs = ref(0);
const recentActivity = ref([]);

onMounted(async () => {
  try {
    const [inquiries, repairs] = await Promise.all([
      getInquiries(),
      listRepairJobs()
    ]);
    newInquiries.value = inquiries.length;

    activeRepairs.value = repairs.filter((r) =>
      ['pending', 'in-progress'].includes(r.status)
    ).length;
    completedRepairs.value = repairs.filter(
      (r) => r.status === 'completed'
    ).length;

    const inquiryActivity = inquiries.slice(0, 5).map((i) => ({
      id: `inquiry-${i.id}`,
      icon: 'mail',
      color: 'primary',
      title: `New inquiry from ${i.name || 'Unknown'}`,
      subtitle: `${i.cameraBrand || ''} ${i.cameraModel || ''}`.trim()
    }));

    const repairActivity = repairs.slice(0, 5).map((r) => ({
      id: `repair-${r.id}`,
      icon: 'build',
      color: r.status === 'completed' ? 'positive' : 'warning',
      title: `Repair ${r.status || 'job'}`,
      subtitle: `${r.customerName || 'Customer'} • ${
        r.deviceModel || ''
      }`.trim()
    }));

    recentActivity.value = [...inquiryActivity, ...repairActivity].slice(0, 8);
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
.admin-page {
  background: #f5f7fa;
  min-height: 100%;
}

/* Cards */
.admin-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 12px;
}

/* Recent activity list scroll on small screens */
.recent-activity-list {
  max-height: 300px;
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-h6 {
    font-size: 1rem;
  }
  .text-h4 {
    font-size: 1.5rem;
  }
  .text-subtitle2 {
    font-size: 0.85rem;
  }
}
</style>
