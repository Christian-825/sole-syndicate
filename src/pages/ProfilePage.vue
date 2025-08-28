<template>
  <div class="container my-5 d-flex flex-column align-items-center gap-4">

    <!-- My Account Card -->
    <div class="card border border-black shadow-sm" style="max-width: 500px; width: 100%;">
      <div class="card-body">
        <h4 class="card-title text-center mb-4">Account Details</h4>

        <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between">
            <strong>Name:</strong>
            <span>{{ user.name || 'N/A' }}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <strong>Email:</strong>
            <span>{{ user.email || 'N/A' }}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <strong>Mobile:</strong>
            <span>{{ user.mobile || 'N/A' }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Reset Password Card -->
    <div class="card border border-black shadow-sm" style="max-width: 500px; width: 100%;">
      <div class="card-body">
        <h4 class="card-title text-center mb-4">Reset Password</h4>

        <form @submit.prevent="resetPassword">
          <div class="mb-3">
            <label for="newPassword" class="form-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              v-model="newPassword"
              class="form-control"
              placeholder="Enter new password"
              required
            />
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              class="form-control"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button type="submit" class="btn btn-dark w-100">Reset Password</button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGlobalStore } from '@/stores/global'; // adjust path as needed
import api from '@/api'; // adjust path as needed
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);

const newPassword = ref('');
const confirmPassword = ref('');
const notyf = new Notyf();

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    notyf.error('Passwords do not match');
    return;
  }

  try {
    await api.patch('/users/update-password', {
  newPassword: newPassword.value
});

    notyf.success('Password reset successfully!');
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    notyf.error(error.response?.data?.message || 'Failed to reset password');
  }
};
</script>
