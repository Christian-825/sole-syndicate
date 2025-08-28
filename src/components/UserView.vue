<template>
  <div class="row">
    <div class="col my-5">
      <h1 class="text-center text-primary py-1">Courses Offered</h1>
      <p class="text-center">Select a course to enroll in!</p>
      <CourseSearch />
    </div>
  </div>

  <div class="row g-4">
    <ProductComponent
      v-for="product in products"
      :key="product._id"
      :product="product"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductComponent from './ProductComponent.vue';
import ProductSearch from './ProductSearch.vue';

const products = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_COURSE_BOOKING_API}/products/active`);
    products.value = res.data;
  } catch (err) {
    console.error('Failed to fetch products:', err);
  }
});
</script>
