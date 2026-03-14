<template>
  <q-page class="inquiry-page">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Camera repair & service</h1>
        <p class="hero-subtitle">
          Submit your repair request and we’ll get back to you quickly.
        </p>
      </div>
    </section>

    <section class="form-section">
      <q-card class="form-card q-pa-lg">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-medium form-title">Request a repair</div>
          <div class="text-body2 text-grey-7">
            Fill in the details below. We’ll contact you to confirm and arrange drop-off.
          </div>
        </q-card-section>
        <q-separator class="q-my-md" />
        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.name"
                  label="Your name"
                  dense
                  outlined
                  required
                  class="input-field"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.phone"
                  label="Phone number"
                  dense
                  outlined
                  required
                  class="input-field"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.cameraBrand"
                  label="Camera brand"
                  dense
                  outlined
                  required
                  class="input-field"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.cameraModel"
                  label="Camera model"
                  dense
                  outlined
                  required
                  class="input-field"
                />
              </div>
            </div>
            <q-input
              v-model="form.issueDescription"
              label="Describe the issue"
              type="textarea"
              outlined
              autogrow
              required
              rows="3"
              class="input-field"
            />
            <q-select
              v-model="form.preferredLocation"
              :options="locationOptions"
              label="Preferred drop-off location"
              dense
              outlined
              class="input-field"
            />

            <div class="row justify-end q-gutter-sm q-pt-sm">
              <q-btn
                label="Clear"
                flat
                color="grey-7"
                @click="onReset"
                :disable="loading"
              />
              <q-btn
                label="Submit request"
                color="primary"
                type="submit"
                :loading="loading"
                no-caps
                class="submit-btn"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </section>
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
const loading = ref(false);

function onReset() {
  form.value = {
    name: '',
    phone: '',
    cameraBrand: '',
    cameraModel: '',
    issueDescription: '',
    preferredLocation: null
  };
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

    await createInquiry(payload);
    $q.notify({ type: 'positive', message: 'Request submitted. We’ll be in touch soon.' });
    onReset();
  } catch (err) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'Something went wrong. Please try again.' });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.inquiry-page {
  min-height: 100%;
  background: #f5f7fa;
}
.hero {
  background: linear-gradient(135deg, #0d47a1 0%, #1565c0 100%);
  color: #fff;
  padding: 3rem 1.5rem;
  text-align: center;
}
.hero-content {
  max-width: 600px;
  margin: 0 auto;
}
.hero-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.hero-subtitle {
  margin: 0;
  font-size: 1rem;
  opacity: 0.95;
}
.form-section {
  padding: 2rem 1.5rem 3rem;
  max-width: 640px;
  margin: 0 auto;
}
.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.form-title {
  color: #0d47a1;
}
.submit-btn {
  min-width: 140px;
}
@media (min-width: 600px) {
  .hero {
    padding: 4rem 2rem;
  }
  .hero-title {
    font-size: 2rem;
  }
}
</style>
