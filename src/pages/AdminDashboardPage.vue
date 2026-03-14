<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">New inquiries</div>
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

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Active repairs</div>
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

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Completed repairs</div>
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

    <div class="q-mt-lg">
      <q-card>
        <q-card-section>
          <div class="text-h6">Recent activity</div>
          <div class="text-subtitle2">
            Latest inquiries and repair job updates
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
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

