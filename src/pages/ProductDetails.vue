<template>
  <nav class="breadcrumb">
    <router-link to="/" class="text-secondary no-underline" style="text-decoration: none; color: inherit;">
      HOME
    </router-link>
    <span class="mx-1 text-muted">/</span>
    <router-link to="/productsCatalog" class="text-secondary no-underline" style="text-decoration: none; color: inherit;">
      PRODUCT CATALOG
    </router-link>
    <span class="mx-1 text-muted">/</span>
    <span class="text-gray-800">{{ product?.name?.toUpperCase() || '' }}</span>
  </nav>

  <div v-if="error">
    <p class="text-center text-danger mt-5">Product not found.</p>
  </div>

  <div v-else-if="!product">
    <p class="text-center mt-5">Loading...</p>
  </div>

  <div v-else class="product-details-page">
    <div class="images-section">
      <img :src="product.imageUrl || defaultImage" alt="Main Product Image" class="main-image" />
    </div>

    <div class="info-section">
      <h2>{{ product.name }}</h2>
      <h3>₱{{ product.price.toLocaleString() }}</h3>

      <div class="sizes">
        <label><strong>Choose a Size:</strong></label>
        <div class="size-squares">
          <div
            v-for="size in product.sizes"
            :key="size"
            :class="['size-square', selectedSize === size ? 'selected' : '']"
            @click="selectSize(size)"
          >
            {{ size }}
          </div>
        </div>
      </div>

      <button class="add-to-cart" @click="addToCart">ADD TO CART</button>

      <div class="desc">
        <p>{{ product.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import jordan1 from '@/assets/jordan1.jpg';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default {
  name: "ProductDetails",
  data() {
    return {
      product: null,
      selectedSize: null,
      error: false,
      defaultImage: jordan1
    };
  },
  async created() {
    const id = this.$route.params.id;

    try {
      const response = await api.get(`/products/${id}`);
      this.product = {
        ...response.data,
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
      };
      this.selectedSize = this.product.sizes[0];
    } catch (err) {
      console.error("Product not found:", err);
      this.error = true;
    }
  },
  methods: {
    selectSize(size) {
      this.selectedSize = size;
    },

    async addToCart() {
      if (!this.selectedSize) {
        notyf.error("Please select a size.");
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        notyf.error("You must be logged in to add items to cart.");
        return;
      }

      try {
        // 🔑 Log product and selected size
        console.log("🧾 Product:", this.product);
        console.log("👟 Selected Size:", this.selectedSize);

        const cartRes = await api.get('/cart/get-cart', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const cartItems = cartRes.data?.cart?.cartItems || [];

        const existingItem = cartItems.find(
          item =>
            item.productId === this.product._id ||
            item.productId?._id === this.product._id
        ) && cartItems.find(item => item.size == this.selectedSize);

        const quantity = existingItem ? existingItem.quantity + 1 : 1;

        const payload = {
          productId: this.product._id,
          quantity,
          size: this.selectedSize
        };

        console.log("🛒 Payload to add:", payload);

        await api.post('/cart/add-to-cart', payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        notyf.success("Added to cart!");
        this.$router.push('/productsCatalog');
      } catch (error) {
        console.error("❌ Add to cart failed:", error.response?.data || error.message);
        notyf.error("Failed to add item to cart.");
      }
    }
  }
};
</script>

<style scoped>
.breadcrumb {
  margin: 2rem auto;
  max-width: 90%;
}

.product-details-page {
  display: flex;
  flex-direction: row;
  gap: 40px;
  margin: 32px auto;
  max-width: 1200px;
  padding: 0 1rem;
}

.images-section {
  flex: 1;
  width: 100%;
  max-width: 500px;
  height: auto;
  margin-left: 0;
}

.main-image {
  width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: cover;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sizes {
  margin: 2rem 0 3rem;
  max-width: 100%;
}

.size-squares {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.size-square {
  width: 50px;
  height: 40px;
  border: 1px solid #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.2s, background 0.2s;
}

.size-square.selected {
  border-color: #111;
  background: #000;
  font-weight: bold;
  color: whitesmoke;
}

.add-to-cart {
  background: #111;
  color: #fff;
  padding: 10px 0;
  border: none;
  border-radius: 3px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
  width: 100%;
  max-width: 400px;
}

.desc {
  margin-top: 18px;
  color: #444;
  font-size: 14px;
  max-width: 400px;
}

@media (max-width: 992px) {
  .product-details-page {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .images-section,
  .info-section {
    max-width: 90%;
    width: 100%;
  }

  .info-section {
    align-items: center;
  }

  .add-to-cart,
  .desc {
    width: 100%;
    max-width: 90%;
  }
}

@media (max-width: 576px) {
  .size-square {
    width: 42px;
    height: 36px;
    font-size: 11px;
  }

  h2 {
    font-size: 1.4rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  .breadcrumb {
    font-size: 0.85rem;
  }
}
</style>
