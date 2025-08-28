<script setup>
import { watch, ref, onBeforeMount } from 'vue';
import { Notyf } from 'notyf';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global.js';
import axios from 'axios'; // ✅ plain axios for public route

const notyf = new Notyf();
const router = useRouter();
const { user } = useGlobalStore();

// ✅ Base API URL
const BASE_URL = import.meta.env.VITE_JOB_TRACKER_API;

const firstName = ref('');
const lastName = ref('');
const mobileNum = ref('');
const email = ref('');
const password = ref('');
const confirmPass = ref('');
const isEnabled = ref(false);

// ✅ Enable submit only if all fields filled & passwords match
watch(
  [email, password, confirmPass, firstName, lastName, mobileNum],
  (currentValue) => {
    if (
      currentValue.every((input) => input !== '') &&
      currentValue[1] === currentValue[2]
    ) {
      isEnabled.value = true;
    } else {
      isEnabled.value = false;
    }
  }
);

async function handleSubmit() {
  try {
    // ✅ Directly register user
    let response = await axios.post(`${BASE_URL}/users/register`, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      mobileNo: mobileNum.value,
      password: password.value
    });

    if (response.status === 201) {
      notyf.success(response.data.message);

      // ✅ Reset fields
      firstName.value = '';
      lastName.value = '';
      mobileNum.value = '';
      email.value = '';
      password.value = '';
      confirmPass.value = '';

      // ✅ Redirect to login
      router.push({ path: '/login' });
    } else {
      notyf.error('Registration failed. Please contact administrator.');
    }
  } catch (e) {
    if (
      e.response?.status === 404 ||
      e.response?.status === 401 ||
      e.response?.status === 400 ||
      e.response?.status === 409
    ) {
      notyf.error(e.response.data.message);
    } else {
      console.error(e);
      notyf.error('Registration failed. Please contact administrator.');
    }
  }
}

// ✅ Redirect logged-in users away from Register page
onBeforeMount(() => {
  if (user.token) {
    router.push({ path: '/productsCatalog' });
  }
});
</script>

<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center mt-5"> 
      <div class="col-md-4 border border-black rounded-3 mx-auto p-3 shadow-sm">
        <h3 class="mb-3 text-dark text-center fw-bold">Register</h3> 
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="fName" class="form-label">First Name</label>
            <input
              type="text"
              class="form-control border border-black"
              id="fName"
              v-model="firstName"
            />
          </div>
          <div class="mb-3">
            <label for="lName" class="form-label">Last Name</label>
            <input
              type="text"
              class="form-control border border-black"
              id="lName"
              v-model="lastName"
            />
          </div>
          <div class="mb-3">
            <label for="mobile" class="form-label">Mobile Number</label>
            <input
              type="text"
              class="form-control border border-black"
              id="mobile"
              v-model="mobileNum"
            />
          </div>
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email Address</label>
            <input
              type="email"
              class="form-control border border-black"
              id="emailInput"
              v-model="email"
            />
          </div>
          <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
            <input
              type="password"
              class="form-control border border-black"
              id="passwordInput"
              v-model="password"
            />
          </div>
          <div class="mb-3">
            <label for="cpasswordInput" class="form-label">Confirm Password</label>
            <input
              type="password"
              class="form-control border border-black"
              id="cpasswordInput"
              v-model="confirmPass"
            />
          </div>
          <div class="d-grid mt-4">
            <button
              type="submit"
              class="btn btn-dark btn-block"
              v-if="isEnabled"
            >
              Submit
            </button>
            <button
              type="submit"
              class="btn btn-outline-dark btn-block"
              v-else
              disabled
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>