<template>
  <div class="container my-5" style="max-width: 500px">
    <h1 class="text-center">Update Product</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="productNameInput" class="form-label">Product Name</label>
        <input type="text" class="form-control" id="productNameInput" v-model="name" />
      </div>
      <div class="mb-3">
        <label for="productDescription" class="form-label">Description</label>
        <textarea class="form-control" id="productDescription" v-model="description" rows="5"></textarea>
      </div>
      <div class="mb-3">
        <label for="productPrice" class="form-label">Price</label>
        <input type="number" class="form-control" id="productPrice" v-model="price" />
      </div>
      <button type="submit" class="btn btn-outline-primary fw-semibold" v-if="isEnabled">Update Product</button>
      <button type="submit" class="btn btn-outline-danger fw-semibold" disabled v-else>Update Product</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Notyf } from "notyf";
import { useRouter, useRoute } from "vue-router";
import { useGlobalStore } from "../stores/global";
import api from "../api";

const notyf = new Notyf();
const router = useRouter();
const route = useRoute();
const { user } = useGlobalStore();

const productId = route.params.productId;

const name = ref(""), description = ref(""), price = ref(0);
const originalName = ref(""), originalDescription = ref(""), originalPrice = ref(0);
const isEnabled = ref(false);

async function fetchProduct() {
  try {
    const response = await api.get(`/products/${productId}`);
    const product = response.data;
    name.value = product.name;
    description.value = product.description;
    price.value = product.price;
    originalName.value = product.name;
    originalDescription.value = product.description;
    originalPrice.value = product.price;
  } catch (error) {
    console.error("Error fetching product:", error);
    notyf.error("Failed to load product.");
  }
}

async function handleSubmit() {
  const updatedProduct = {
    name: normalize(name.value),
    description: normalize(description.value),
    price: price.value,
  };
  try {
    const response = await api.patch(`/products/${productId}/update`, updatedProduct);
    if (response.status === 200) {
      notyf.success("Product updated successfully.");
      router.push({ path: "/adminDashboard" });
    } else {
      notyf.error("Failed to update product.");
    }
  } catch (error) {
    console.error("Update error:", error);
    notyf.error("Something went wrong.");
  }
}

const normalize = str => str.trim().replace(/\s+/g, " ");

watch([name, description, price], () => isEnabled.value = normalize(name.value) !== normalize(originalName.value) || normalize(description.value) !== normalize(originalDescription.value) || price.value !== originalPrice.value);

onMounted(() => (!user.token || !user.isAdmin) ? router.push({ path: "/products" }) : fetchProduct());
</script>
