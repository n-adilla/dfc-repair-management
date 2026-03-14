<template>
  <q-page padding class="bg-grey-2">
    <q-card class="q-pa-lg q-mx-auto" style="max-width: 600px; width: 100%">
      <q-card-section>
        <div class="text-h6">Inquiry Form</div>
        <div class="text-subtitle2">
          Submit your repair inquiry and we will get back to you.
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input v-model="form.name" label="Name" dense outlined required />
          <q-input
            v-model="form.phone"
            label="Phone"
            dense
            outlined
            required
          />
          <q-input
            v-model="form.cameraBrand"
            label="Camera brand"
            dense
            outlined
            required
          />
          <q-input
            v-model="form.cameraModel"
            label="Camera model"
            dense
            outlined
            required
          />
          <q-input
            v-model="form.issueDescription"
            label="Issue description"
            type="textarea"
            outlined
            autogrow
            required
          />
          <q-select
            v-model="form.preferredLocation"
            :options="locationOptions"
            label="Preferred drop-off location"
            dense
            outlined
          />

          <div>
            <div class="text-caption q-mb-xs">Attach images (optional)</div>
            <input
              ref="fileInputRef"
              type="file"
              multiple
              accept="image/*"
              @change="onFilesSelected"
            />
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Reset"
              flat
              color="secondary"
              @click="onReset"
              :disable="loading"
            />
            <q-btn
              label="Submit"
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
import { useQuasar } from 'quasar';
import { createInquiry } from '@/services/inquiriesService';

const $q = useQuasar();

const form = ref({
  name: '',
  phone: '',
  cameraBrand: '',
  cameraModel: '',
  issueDescription: '',
  preferredLocation: null
});

const locationOptions = ['Main Branch', 'Mall Kiosk', 'Pickup Service'];

const files = ref([]);
const fileInputRef = ref(null);
const loading = ref(false);

function onFilesSelected(event) {
  files.value = Array.from(event.target.files || []);
}

function onReset() {
  form.value = {
    name: '',
    phone: '',
    cameraBrand: '',
    cameraModel: '',
    issueDescription: '',
    preferredLocation: null
  };
  files.value = [];
  if (fileInputRef.value) {
    fileInputRef.value.value = null;
  }
}

async function onSubmit() {
  try {
    loading.value = true;
    const payload = {
      name: form.value.name,
      phone: form.value.phone,
      cameraBrand: form.value.cameraBrand,
      cameraModel: form.value.cameraModel,
      issueDescription: form.value.issueDescription,
      preferredLocation: form.value.preferredLocation
    };

    await createInquiry(payload, files.value);
    $q.notify({ type: 'positive', message: 'Inquiry submitted successfully.' });
    onReset();
  } catch (err) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'Failed to submit inquiry.' });
  } finally {
    loading.value = false;
  }
}
</script>

