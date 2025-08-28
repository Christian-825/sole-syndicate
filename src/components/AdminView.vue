<template>
  <h1 class="text-center text-dark my-5">Admin Dashboard</h1>

  <div class="d-flex justify-content-center align-items-center gap-2 mb-4 flex-wrap">
    <router-link to="/addProduct">
      <button class="btn btn-outline-dark fw-bold">Add New Product</button>
    </router-link>
    <router-link to="/admin/orders">
      <button class="btn btn-outline-dark fw-bold">Show User Orders</button>
    </router-link>

    <div class="dropdown">
      <button class="btn btn-outline-dark dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Filter Products
      </button>
      <ul class="dropdown-menu">
        <li><button class="dropdown-item" @click="selectedFilter = 'all'">All Products</button></li>
        <li><button class="dropdown-item" @click="selectedFilter = 'active'">Active Products</button></li>
        <li><button class="dropdown-item" @click="selectedFilter = 'archived'">Archived Products</button></li>
      </ul>
    </div>
  </div>

  <!-- DESKTOP TABLE -->
  <div class="table-responsive d-none d-md-block">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Availability</th>
          <th colspan="2" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product._id">
          <td>{{ product._id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>₱{{ Number(product.price).toLocaleString() }}</td>
          <td>
            <span v-if="product.isActive" class="text-success">Available</span>
            <span v-else class="text-danger">Unavailable</span>
          </td>
          <td colspan="2">
            <div class="d-flex flex-column gap-2">
              <router-link :to="`/updateProduct/${product._id}`">
                <button class="btn btn-outline-dark fw-semibold px-3">Update</button>
              </router-link>
              <button v-if="product.isActive" class="btn btn-danger fw-semibold" @click="toggleProductStatus(product)">Disable</button>
              <button v-else class="btn btn-success fw-semibold" @click="toggleProductStatus(product)">Activate</button>
              <button class="btn btn-dark fw-semibold" @click="deleteProduct(product._id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MOBILE VIEW -->
  <div class="d-block d-md-none small-screen-product-list">
    <div v-for="product in filteredProducts" :key="product._id" class="border mb-3 p-2">
      <div class="border p-1"><strong>ID:</strong> {{ product._id }}</div>
      <div class="border p-1"><strong>Name:</strong> {{ product.name }}</div>
      <div class="border p-1"><strong>Description:</strong> {{ product.description }}</div>
      <div class="border p-1"><strong>Price:</strong> ₱{{ Number(product.price).toLocaleString() }}</div>
      <div class="border p-1">
        <strong>Availability:</strong>
        <span v-if="product.isActive" class="text-success">Available</span>
        <span v-else class="text-danger">Unavailable</span>
      </div>
      <div class="border p-1 d-flex flex-wrap gap-1 mt-2 justify-content-start">
        <router-link :to="`/updateProduct/${product._id}`">
          <button class="btn btn-outline-dark btn-sm fw-semibold">Update</button>
        </router-link>
        <button
          v-if="product.isActive"
          class="btn btn-danger btn-sm fw-semibold"
          @click="toggleProductStatus(product)"
        >
          Disable
        </button>
        <button
          v-else
          class="btn btn-success btn-sm fw-semibold"
          @click="toggleProductStatus(product)"
        >
          Activate
        </button>
        <button class="btn btn-dark btn-sm fw-semibold" @click="deleteProduct(product._id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../api";

const products = ref([]);
const selectedFilter = ref("all");

const filteredProducts = computed(() => {
  if (selectedFilter.value === "active") {
    return products.value.filter(product => product.isActive);
  } else if (selectedFilter.value === "archived") {
    return products.value.filter(product => !product.isActive);
  }
  return products.value;
});

const deleteProduct = async (productId) => {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    await api.delete(`/products/${productId}`);
    products.value = products.value.filter(p => p._id !== productId);
  } catch (error) {
    console.error("Failed to delete product:", error);
    alert("Something went wrong while deleting the product.");
  }
};

const patchProduct = async (product, route) => {
  try {
    await api.patch(`/products/${product._id}/${route}`);
  } catch (error) {
    console.error("Failed to patch product:", error);
    alert(`Failed to ${route} the product.`);
  }
};

const toggleProductStatus = async (product) => {
  const action = product.isActive ? "archive" : "activate";
  try {
    await patchProduct(product, action);
    product.isActive = !product.isActive;
  } catch (error) {
    console.error(`Failed to ${action} product`, error);
  }
};

onMounted(async () => {
  try {
    const response = await api.get("/products/all");
    products.value = response.data;
  } catch (error) {
    console.error("Failed to load products", error);
  }
});
</script>

<style scoped>
/* Shrink font and button sizes for small screens */
@media (max-width: 768px) {
  .small-screen-product-list {
    font-size: 0.85rem;
  }

  .small-screen-product-list .btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>
