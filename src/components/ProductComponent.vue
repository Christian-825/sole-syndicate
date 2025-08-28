<template>
  <div v-if="product" class="product-card-wrapper w-100">
    <router-link :to="`${linkBase}/${product._id}`" class="text-decoration-none text-dark">
      <div class="card">
        <img
          class="card-img-top"
          :src="product.image || fallbackImage"
          :alt="product.name"
        />
        <div class="card-body text-start">
          <!-- Admin-only Status Badge -->
          <span
            v-if="isAdmin"
            class="badge mb-2"
            :class="product.isActive ? 'bg-success' : 'bg-danger'"
          >
            {{ product.isActive ? 'ACTIVE' : 'INACTIVE' }}
          </span>

          <h5 class="card-title mb-2">{{ product.name }}</h5>
          <p class="card-text">₱{{ Number(product.price).toLocaleString() }}</p>
        </div>
      </div>
    </router-link>
  </div>

  <div v-else class="text-center text-muted">
    Loading product...
  </div>
</template>

<script>
import jordan1 from "@/assets/jordan1.jpg";

export default {
  name: "ProductComponent",
  props: {
    product: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    linkBase: {
      type: String,
      default: "/products"
    }
  },
  computed: {
    fallbackImage() {
      return jordan1;
    }
  }
};
</script>

<style scoped>
.product-card-wrapper {
  width: 330px;
  margin: auto;
}

.card {
  background: #ffffff;
  text-align: start;
  transition: box-shadow 0.2s;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.05);
  border: none;
  display: block;
  color: inherit;
  height: 100%;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.13);
}

.card-img-top {
  width: 100%;
  min-height: 300px;
  object-fit: cover;
  border-radius: 6px 6px 0 0;
}

@media (max-width: 576px) {
  .card-img-top {
    min-height: 180px;
  }
}

</style>
