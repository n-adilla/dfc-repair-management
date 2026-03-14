<template>
  <q-page class="inquiry-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <img src="@/assets/digitalfix-logo.png" alt="DigitalFix Logo" class="hero-icon" />
        <h1 class="hero-title">Need it fixed?</h1>
        <p class="hero-subtitle">
          Submit your service or repair request and we’ll handle your devices with care.
        </p>
        <q-btn
          color="orange-8"
          label="Submit a Request"
          unelevated
          class="hero-btn"
          @click="scrollToForm"
        />
      </div>
    </section>

    <!-- Form Section -->
    <section ref="formSection" class="form-section" :class="{ 'animate-in': animateForm }">
      <q-card class="form-card q-pa-lg">
        <!-- Background illustration watermark -->
        <div class="form-bg-illustration"></div>

        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <!-- Name & Phone -->
            <div class="row q-col-gutter-md form-row" style="--delay: 0s;">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.name"
                  label="Full Name"
                  dense
                  outlined
                  required
                  clearable
                  filled
                  class="form-input"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.phone"
                  label="Phone Number"
                  dense
                  outlined
                  required
                  clearable
                  filled
                  class="form-input"
                />
              </div>
            </div>

            <!-- Camera Details -->
            <div class="row q-col-gutter-md form-row" style="--delay: 0.1s;">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.cameraBrand"
                  label="Camera Brand"
                  dense
                  outlined
                  required
                  filled
                  class="form-input"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.cameraModel"
                  label="Camera Model"
                  dense
                  outlined
                  required
                  filled
                  class="form-input"
                />
              </div>
            </div>

            <!-- Issue Description -->
            <div class="row q-col-gutter-md form-row" style="--delay: 0.2s;">
              <q-input
                v-model="form.issueDescription"
                label="Describe the issue"
                type="textarea"
                outlined
                autogrow
                required
                rows="4"
                filled
                class="form-input"
              />
            </div>

            <!-- Preferred Location -->
            <div class="row q-col-gutter-md form-row" style="--delay: 0.3s;">
              <q-select
                v-model="form.preferredLocation"
                :options="locationOptions"
                label="Preferred drop-off location"
                dense
                outlined
                filled
                class="form-input"
              />
            </div>

            <!-- Action Buttons -->
            <div class="row justify-end form-actions form-row" style="--delay: 0.4s;">
              <q-btn
                label="Clear"
                flat
                color="grey-7"
                @click="onReset"
                :disable="loading"
              />
              <q-btn
                label="Submit Request"
                color="orange-8"
                type="submit"
                :loading="loading"
                no-caps
                unelevated
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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { createInquiry } from '@/services/inquiriesService';

const $q = useQuasar();
const formSection = ref(null);
const animateForm = ref(false); // triggers animation once

const form = ref({
  name: '',
  phone: '',
  cameraBrand: '',
  cameraModel: '',
  issueDescription: '',
  preferredLocation: null
});

const locationOptions = [
  'Seremban',
  'Ampang (Ampang Saujana/Lembah Jaya)',
  'Pickup Service (Seremban and Klang Valley only)'
];

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
    await createInquiry({ ...form.value });
    $q.notify({ type: 'positive', message: 'Request submitted. We’ll be in touch soon.' });
    onReset();
  } catch (err) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'Something went wrong. Please try again.' });
  } finally {
    loading.value = false;
  }
}

// Smooth scroll to form
function scrollToForm() {
  formSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Animate form once using Intersection Observer
onMounted(() => {
  if (!formSection.value) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateForm.value = true; // trigger animation
          observer.disconnect(); // disconnect to animate only once
        }
      });
    },
    { threshold: 0.2 } // trigger when 20% of the form is visible
  );

  observer.observe(formSection.value);
});
</script>

<style scoped>
.inquiry-page {
  min-height: 100%;
  background: #f9fafb;
}

/* Hero section */
.hero {
  background: linear-gradient(135deg, #fff 0%, #fff 100%);
  color: #fff;
  padding: 4rem 1.5rem 2rem;
  text-align: center;
  position: relative;
}
.hero-icon {
  width: 200px;
  margin-bottom: 1rem;
  opacity: 0.9;
}
.hero-title {
  color: #000;
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}
.hero-subtitle {
  color: #000;
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}
.hero-btn {
  font-weight: 600;
}

/* Form section */
.form-section {
  padding: 3rem 1.5rem 4rem;
  max-width: 720px;
  margin: 0 auto;
  position: relative;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease;
}
.form-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered animation for rows */
.form-row {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeSlideUp 0.5s forwards;
  animation-delay: var(--delay);
}

@keyframes fadeSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-card {
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}

/* Background illustration watermark */
.form-bg-illustration {
  position: absolute;
  top: 0;
  right: 0;
  width: 220px;
  height: 220px;
  background: url('/statics/camera-watermark.svg') no-repeat center;
  background-size: contain;
  opacity: 0.07;
  pointer-events: none;
  z-index: 0;
}

.form-card q-card-section {
  position: relative;
  z-index: 1;
}

.submit-btn {
  min-width: 160px;
}

/* Inputs */
.form-input {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;
}
.form-input textarea {
  padding: 8px;
}

.input-field >>> .q-field__control {
  background-color: #f9fafb !important;
  border-radius: 8px;
}

/* Buttons row spacing */
.form-actions {
  margin-top: 24px;
  gap: 8px;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .hero-title {
    font-size: 2.75rem;
  }
  .hero-subtitle {
    font-size: 1.25rem;
  }
}
</style>
