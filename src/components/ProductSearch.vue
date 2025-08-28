<template>
  <div class="container-fluid mx-2 py-4">
    <form @submit.prevent="searchProducts" class="mb-4 w-100" style="max-width: 100%;">
      <div class="position-relative w-100">
        <input
          type="text"
          v-model="productName"
          class="form-control form-control-lg ps-5"
          placeholder="Search"
          required
          style="height: 50px;"
        />

        <!-- Search Icon -->
        <img
          :src="searchIcon"
          alt="Search"
          @click="searchProducts"
          class="position-absolute"
          style="top: 50%; left: 15px; transform: translateY(-50%); height: 24px; width: 24px; cursor: pointer;"
        />

        <!-- Cancel Text - clears only the input text -->
        <span
          v-if="productName"
          @click="clearSearch"
          class="position-absolute text-muted"
          style="top: 50%; transform: translateY(-50%); right: 15px; font-size: 16px; cursor: pointer;"
        >
          Cancel
        </span>
      </div>
    </form>

    <div v-if="products.length">
      <h5 class="mb-5">Results:</h5>
      <div class="row d-flex justify-content-start">
        <div class="col-md-3 mb-5" v-for="product in products" :key="product._id">
          <ProductComponent
            :product="product"
            :isAdmin="isAdmin"
          />
        </div>
      </div>
    </div>

    <div v-else-if="!loading && hasSearched">
      <p class="text-muted">No products found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '../api'
import ProductComponent from './ProductComponent.vue'
import searchIcon from '@/assets/search-icon.png'
import { useGlobalStore } from '@/stores/global' // ✅ import store

const store = useGlobalStore()
const isAdmin = computed(() => store.user?.isAdmin === true) // ✅ admin check

const route = useRoute()
const router = useRouter()

const productName = ref(route.query.q || '')
const products = ref([])
const loading = ref(false)
const hasSearched = ref(false)

const notyf = new Notyf()
const emit = defineEmits(['closeSearch'])

const searchProducts = async () => {
  if (!productName.value.trim()) {
    notyf.error('Please enter a product name.')
    return
  }

  loading.value = true
  hasSearched.value = true

  try {
    const response = await api.post('/products/search-by-name', {
      name: productName.value.trim(),
    })
    products.value = response.data || []

    if (products.value.length) {
      notyf.success(`Found ${products.value.length} product(s).`)
    } else {
      notyf.error('No products found.')
    }
  } catch (error) {
    console.error(error)
    notyf.error('Something went wrong while searching.')
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  productName.value = ''
  router.replace({ query: {} })
}

onMounted(() => {
  if (productName.value) {
    searchProducts()
  }
})

watch(() => route.query.q, (newQ) => {
  productName.value = newQ || ''
  if (productName.value) {
    searchProducts()
  }
})
</script>

<style scoped>
.list-group-item + .list-group-item {
  margin-top: 0.5rem;
}

.input-group input {
  font-size: 1.1rem;
  padding: 0.75rem 1rem;
}

.position-relative {
  position: relative;
}
</style>
