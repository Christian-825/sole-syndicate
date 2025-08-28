<template>
  <div class="container my-5 product-catalog">
    <nav class="breadcrumb ms-4 d-flex align-items-center">
      <router-link to="/" class="text-decoration-none text-secondary fw-semibold">HOME</router-link>
      <span class="mx-1 text-muted">/</span>
      <span class="text-dark fw-semibold">PRODUCT CATALOG</span>

      <!-- Right-aligned Search Icon and Filter Icon Dropdown -->
      <div class="ms-auto d-flex align-items-center gap-3">
        <!-- Search Icon or Cancel -->
        <span v-if="!showSearch" @click="openSearch" style="cursor: pointer;">
          <img :src="searchIcon" alt="Search Icon" style="width: 24px; height: 24px;" />
        </span>
        <span v-else class="text-decoration-underline text-dark fw-semibold" @click="closeSearch"
          style="cursor: pointer; font-size: 16px;">
          Cancel
        </span>

        <!-- Filter Icon Dropdown for Admins -->
        <div class="dropdown" v-if="isAdmin">
          <button class="btn p-0 border-0 bg-transparent dropdown-toggle" type="button" data-bs-toggle="dropdown"
            aria-expanded="false" title="Filter Products">
            <i class="bi bi-filter fs-5 text-dark"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item" @click="applyFilter('all')">All Products</button></li>
            <li><button class="dropdown-item" @click="applyFilter('active')">Active Products</button></li>
            <li><button class="dropdown-item" @click="applyFilter('archived')">Archived Products</button></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Product Search Bar -->
    <transition name="slide-search">
      <ProductSearch v-if="showSearch" class="mb-5" />
    </transition>

    <div class="d-flex align-items-center ms-4 mb-4">
      <h5 class="fw-semibold mb-0">SHOP ALL KICKS</h5>
    </div>

    <div v-if="loading">Loading products...</div>
    <div v-else>
      <div class="row g-3 mx-auto">
        <div class="col-6 col-md-4 col-lg-3" v-for="product in filteredProducts" :key="product._id">
          <ProductComponent :product="product" :isAdmin="isAdmin" linkBase="/productsCatalog" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useGlobalStore } from "@/stores/global";
import ProductSearch from "@/components/ProductSearch.vue";
import ProductComponent from "@/components/ProductComponent.vue";
import jordan1 from "@/assets/jordan1.jpg";
import searchIcon from "@/assets/search-icon.png";

export default {
  name: "ProductsCatalog",
  components: {
    ProductSearch,
    ProductComponent
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      selectedFilter: "all",
      loading: false,
      showSearch: false,
      searchIcon
    };
  },
  computed: {
    store() {
      return useGlobalStore();
    },
    isAdmin() {
      return this.store.user?.isAdmin === true;
    }
  },
  methods: {
    openSearch() {
      this.showSearch = true;
    },
    closeSearch() {
      this.showSearch = false;
    },
    applyFilter(type) {
      this.selectedFilter = type;

      if (this.isAdmin) {
        if (type === "active") {
          this.filteredProducts = this.products.filter(p => p.isActive);
        } else if (type === "archived") {
          this.filteredProducts = this.products.filter(p => !p.isActive);
        } else {
          this.filteredProducts = [...this.products];
        }
      }
    }
  },
  async mounted() {
    this.loading = true;

    console.log("Base URL:", import.meta.env.VITE_JOB_TRACKER_API);

    try {
      const endpoint = this.isAdmin ? "products/all" : "products/active"; 

      const response = await axios.get(
        import.meta.env.VITE_JOB_TRACKER_API + endpoint,
        this.isAdmin
          ? {
              headers: {
                Authorization: `Bearer ${this.store.user.token}`
              }
            }
          : {}
      );




      this.products = response.data.map(product => ({
        ...product,
        image: jordan1
      }));

      // Non-admin users should always see active products only
      this.filteredProducts = this.isAdmin
        ? [...this.products]
        : this.products.filter(p => p.isActive);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      this.loading = false;
    }
  }
};
</script>


<style scoped>
.breadcrumb {
  margin-bottom: 2rem;
  font-size: 16px;
}

.product-catalog {
  max-width: 1400px;
  margin: auto;
  margin-bottom: 10rem;
  font-family: Arial, sans-serif;
}

img[alt="Search Icon"] {
  transition: transform 0.2s;
}

img[alt="Search Icon"]:hover {
  transform: scale(1.1);
}

/* Slide-in animation for search bar */
.slide-search-enter-active,
.slide-search-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-search-enter-from,
.slide-search-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}
.slide-search-enter-to,
.slide-search-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px; /* adjust depending on height of your search bar */
}
</style>
