<template>
  <q-page padding>
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-h6">Inquiries</div>
          <div class="text-subtitle2">All customer inquiries</div>
        </div>
        <q-btn flat icon="refresh" :loading="loading" @click="loadInquiries" />
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
              <q-badge
                :color="props.row.status === 'rejected' ? 'negative' : 'primary'"
                outline
              >
                {{ props.row.status || 'new' }}
              </q-badge>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                size="sm"
                icon="visibility"
                @click="viewInquiry(props.row)"
                title="View inquiry"
              />
              <q-btn
                flat
                size="sm"
                icon="chat"
                @click="openWhatsApp(props.row)"
                title="Open WhatsApp chat"
              />
              <q-btn
                v-if="!props.row.convertedToJobId"
                flat
                size="sm"
                icon="build"
                @click="createJobFromInquiry(props.row)"
                title="Create repair job"
              />
              <q-btn
                v-else
                flat
                size="sm"
                icon="check_circle"
                color="positive"
                disable
                title="Already converted to repair job"
              />
              <q-btn
                flat
                size="sm"
                icon="close"
                color="negative"
                @click="rejectInquiry(props.row)"
                title="Reject inquiry"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="detailDialog">
      <q-card style="max-width: 500px; width: 100%">
        <q-card-section>
          <div class="text-h6">Inquiry details</div>
          <div class="text-subtitle2">
            {{ selectedInquiry?.name }} • {{ selectedInquiry?.phone }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="selectedInquiry">
          <div class="q-mb-sm">
            <div class="text-caption text-grey-7">Camera</div>
            <div>
              {{ selectedInquiry.cameraBrand }} {{ selectedInquiry.cameraModel }}
            </div>
          </div>
          <div class="q-mb-sm">
            <div class="text-caption text-grey-7">Issue</div>
            <div>{{ selectedInquiry.issueDescription }}</div>
          </div>
          <div class="q-mb-sm">
            <div class="text-caption text-grey-7">Dropoff location</div>
            <div>{{ selectedInquiry.preferredLocation || '-' }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getInquiries, updateInquiryStatus, updateInquiry } from '@/services/inquiriesService';
import { createJob } from '@/services/repairJobsService';

const $q = useQuasar();
const loading = ref(false);
const rows = ref([]);
const detailDialog = ref(false);
const selectedInquiry = ref(null);

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  {
    name: 'cameraModel',
    label: 'Camera',
    field: 'cameraModel',
    align: 'left'
  },
  {
    name: 'issueDescription',
    label: 'Issue',
    field: 'issueDescription',
    align: 'left'
  },
  { name: 'preferredLocation', label: 'Location', field: 'preferredLocation' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
];

async function loadInquiries() {
  try {
    loading.value = true;
    rows.value = await getInquiries();
  } catch (e) {
    console.error(e);
    $q.notify({ type: 'negative', message: 'Failed to load inquiries.' });
  } finally {
    loading.value = false;
  }
}

async function createJobFromInquiry(inquiry) {
  if (inquiry.convertedToJobId) {
    $q.notify({ type: 'warning', message: 'This inquiry was already converted to a repair job.' });
    return;
  }
  try {
    const jobId = await createJob({
      inquiryId: inquiry.id,
      customerName: inquiry.name,
      phone: inquiry.phone,
      deviceModel: inquiry.cameraModel,
      issueDescription: inquiry.issueDescription,
      status: 'pending'
    });
    await updateInquiry(inquiry.id, { convertedToJobId: jobId });
    $q.notify({
      type: 'positive',
      message: `Repair job created (ID: ${jobId}).`
    });
    await loadInquiries();
  } catch (e) {
    console.error(e);
    $q.notify({ type: 'negative', message: 'Failed to create repair job.' });
  }
}

function viewInquiry(inquiry) {
  selectedInquiry.value = inquiry;
  detailDialog.value = true;
}

function openWhatsApp(inquiry) {
  if (!inquiry.phone) {
    $q.notify({ type: 'warning', message: 'No phone number for this inquiry.' });
    return;
  }
  const phone = inquiry.phone.replace(/\D/g, '');
  const text = encodeURIComponent(
    `Hi ${inquiry.name || ''}, regarding your camera repair inquiry (${inquiry.cameraBrand || ''} ${inquiry.cameraModel || ''}).`
  );
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

async function rejectInquiry(inquiry) {
  try {
    await updateInquiryStatus(inquiry.id, 'rejected');
    $q.notify({ type: 'positive', message: 'Inquiry rejected.' });
    await loadInquiries();
  } catch (e) {
    console.error(e);
    $q.notify({ type: 'negative', message: 'Failed to reject inquiry.' });
  }
}

onMounted(() => {
  loadInquiries();
});
</script>

