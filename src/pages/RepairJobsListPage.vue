<template>
  <q-page padding class="admin-page">
    <q-card flat class="admin-card">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-h6">Repair Jobs</div>
          <div class="text-subtitle2">All repair jobs</div>
        </div>
        <q-btn flat icon="refresh" :loading="loading" @click="loadJobs" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="statusColor(props.row.status)" outline>
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                size="sm"
                icon="edit"
                @click="openJobDialog(props.row)"
                title="Edit job"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="jobDialog">
      <q-card style="max-width: 500px; width: 100%">
        <q-card-section>
          <div class="text-h6">Repair job</div>
          <div class="text-subtitle2">
            {{ jobForm.customerName }} • {{ jobForm.deviceModel }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="jobForm.status"
            :options="statusOptions"
            label="Status"
            outlined
            dense
          />
          <q-input
            v-model="jobForm.diagnosisNotes"
            type="textarea"
            label="Diagnosis notes"
            outlined
            autogrow
          />
          <q-input
            v-model.number="jobForm.repairCost"
            type="number"
            label="Repair cost"
            outlined
            dense
            prefix="$"
          />
        </q-card-section>
        <q-card-actions align="between">
          <q-btn flat label="Close" v-close-popup />
          <div class="row q-gutter-sm">
            <q-btn
              flat
              color="positive"
              label="Mark completed"
              @click="markCompleted"
              :loading="saving"
            />
            <q-btn
              color="primary"
              label="Save"
              @click="saveJob"
              :loading="saving"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { listRepairJobs, updateJob } from '@/services/repairJobsService';

const $q = useQuasar();
const loading = ref(false);
const rows = ref([]);
const jobDialog = ref(false);
const saving = ref(false);
const selectedJobId = ref(null);
const jobForm = ref({
  customerName: '',
  deviceModel: '',
  status: '',
  diagnosisNotes: '',
  repairCost: null
});

const statusOptions = ['pending', 'in-progress', 'completed', 'cancelled'];

const columns = [
  { name: 'customerName', label: 'Customer', field: 'customerName' },
  { name: 'phone', label: 'Phone', field: 'phone' },
  { name: 'deviceModel', label: 'Device', field: 'deviceModel' },
  {
    name: 'issueDescription',
    label: 'Issue',
    field: 'issueDescription',
    align: 'left'
  },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
];

async function loadJobs() {
  try {
    loading.value = true;
    rows.value = await listRepairJobs();
  } catch (e) {
    console.error(e);
    $q.notify({ type: 'negative', message: 'Failed to load repair jobs.' });
  } finally {
    loading.value = false;
  }
}

function statusColor(status) {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in-progress':
      return 'info';
    case 'completed':
      return 'positive';
    case 'cancelled':
      return 'negative';
    default:
      return 'grey';
  }
}

function openJobDialog(job) {
  selectedJobId.value = job.id;
  jobForm.value = {
    customerName: job.customerName || '',
    deviceModel: job.deviceModel || '',
    status: job.status || 'pending',
    diagnosisNotes: job.diagnosisNotes || '',
    repairCost: job.repairCost ?? null
  };
  jobDialog.value = true;
}

async function saveJob() {
  if (!selectedJobId.value) return;
  try {
    saving.value = true;
    await updateJob(selectedJobId.value, {
      status: jobForm.value.status,
      diagnosisNotes: jobForm.value.diagnosisNotes,
      repairCost: jobForm.value.repairCost
    });
    $q.notify({ type: 'positive', message: 'Job updated.' });
    jobDialog.value = false;
    await loadJobs();
  } catch (e) {
    console.error(e);
    $q.notify({ type: 'negative', message: 'Failed to update job.' });
  } finally {
    saving.value = false;
  }
}

async function markCompleted() {
  if (!selectedJobId.value) return;
  try {
    saving.value = true;
    await updateJob(selectedJobId.value, {
      status: 'completed',
      diagnosisNotes: jobForm.value.diagnosisNotes,
      repairCost: jobForm.value.repairCost,
      completedAt: new Date()
    });
    $q.notify({ type: 'positive', message: 'Job marked as completed.' });
    jobDialog.value = false;
    await loadJobs();
  } catch (e) {
    console.error(e);
    $q.notify({ type: 'negative', message: 'Failed to complete job.' });
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadJobs();
});
</script>

<style scoped>
.admin-page {
  background: #f5f7fa;
}
.admin-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
</style>

