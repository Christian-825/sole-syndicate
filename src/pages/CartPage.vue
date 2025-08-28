<script setup>
import { onMounted, ref, computed } from 'vue';
import api from '../api';
import { Notyf } from 'notyf';
import jordan1 from '@/assets/jordan1.jpg';

const notyf = new Notyf

const cartItems = ref([]);
const selectedItems = ref([]); // Stores checked item IDs

const fetchCart = async () => {
  try {
    const res = await api.get('/cart/get-cart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const rawItems = res.data.cart?.cartItems || [];
    const detailedItems = await Promise.all(
      rawItems.map(async (item) => {
        const productRes = await api.get(`/products/${item.productId._id}`);

        return {
          ...item,
          productName: productRes.data.name,
          price: productRes.data.price,
          size: item.size,
          image: productRes.data.image || jordan1
        };
      })
    );
    cartItems.value = detailedItems;
  } catch (error) {
    console.error("Cart load error:", error);
    notyf.error('Failed to load cart');
  }
};

const updateQuantity = async (productId, quantity, size) => {
  try {
    await api.patch('/cart/update-cart-quantity', {
      productId,
      quantity,
      size
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    await fetchCart();
    notyf.success('Quantity updated');
  } catch (err) {
    console.error("Update error:", err);
    notyf.error('Update failed');
  }
};
const removeItem = async (itemId) => {
  try {
    await api.delete(`/cart/${itemId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    await fetchCart();
    notyf.success('Item removed');
  } catch {
    notyf.error('Failed to remove item');
  }
};

const clearCart = async () => {
  try {
    await api.put('/cart/clear-cart', null, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    await fetchCart();
    notyf.success('Cart cleared');
  } catch {
    notyf.error('Failed to clear cart');
  }
};

const selectedSubtotals = computed(() =>
  cartItems.value
    .filter(item => selectedItems.value.includes(item._id))
    .map(item => ({
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }))
);

const subtotal = computed(() =>
  selectedSubtotals.value.reduce((sum, item) => sum + item.subtotal, 0)
);

const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) {
    notyf.error('Please select at least one item to proceed.');
    return;
  }
  sessionStorage.setItem('selectedItems', JSON.stringify(selectedItems.value));
  window.location.href = '/checkout';
};

onMounted(() => {
  fetchCart();
});
</script>

<template>
  <div class="container my-5">
    <h2 class="mb-4">Shopping Cart</h2>

    <div v-if="cartItems.length === 0">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <!-- CART ITEMS -->
      <div
        v-for="item in cartItems"
        :key="item._id"
        class="cart-item-box d-flex border border-dark mb-4 p-4 align-items-center w-50"
      >
        <!-- Checkbox -->
        <input
          type="checkbox"
          class="form-check-input me-3"
          :value="item._id"
          v-model="selectedItems"
        />

        <img :src="item.image" alt="Product" class="cart-img me-4" />

        <div class="flex-grow-1">
          <h5 class="mb-1">{{ item.productName }}</h5>
          <p class="mb-1"><strong>Size:</strong> {{ item.size }}</p>

          <div class="d-flex align-items-center mt-2">
            <select
              class="form-select me-3"
              v-model.number="item.quantity"
              @change="updateQuantity(item.productId._id, item.quantity, String(item.size))"
              


            >
              <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
            </select>

            <div class="price-info fw-bold">
              ₱{{ (item.price * item.quantity).toLocaleString() }}
            </div>
          </div>
        </div>

        <button class="btn text-dark fs-4 ms-3" @click="removeItem(item._id)">
          X
        </button>
      </div>

      <!-- CLEAR CART -->
      <div class="d-flex justify-content-end mt-3 mb-4">
        <button class="btn btn-outline-danger btn-clear" @click="clearCart">
          Clear Cart
        </button>
      </div>

      <!-- SUBTOTAL DISPLAY -->
      <div class="border-top pt-4 mb-3">
        <h5 class="mb-3">Selected Items Summary:</h5>
        <ul class="list-unstyled">
          <li
            v-for="item in selectedSubtotals"
            :key="item.name"
            class="d-flex justify-content-between"
          >
            <span>{{ item.name }} (₱{{ item.price.toLocaleString() }} x {{ item.quantity }})</span>
            <strong>₱{{ item.subtotal.toLocaleString() }}</strong>
          </li>
        </ul>
      </div>

      <!-- CHECKOUT -->
      <div
        v-if="selectedItems.length"
        class="d-flex justify-content-between align-items-center border-top pt-3 mt-4"
      >
        <h4 class="mb-0">Subtotal: ₱{{ subtotal.toLocaleString() }}</h4>
        <button class="btn btn-dark" @click="proceedToCheckout">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-img {
  width: 150px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-box {
  background-color: #fff;
  border: 1px solid #ccc;
  border-left: 5px solid #000;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease-in-out;
}

.cart-item-box:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

.price-info {
  font-size: 1.1rem;
  font-weight: 600;
}

select.form-select {
  padding: 0.4rem;
  font-size: 1rem;
  width: 80px;
  border: 1px solid black;
  border-radius: 4px;
}

input.form-check-input {
  appearance: none;
  -webkit-appearance: none;
  background-color: #fff;
  border: 2px solid black;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-right: 1rem;
}

input.form-check-input:checked {
  background-color: black;
}

.btn-clear {
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

@media (max-width: 992px) {
  .cart-item-box {
    flex-direction: column;
    align-items: flex-start;
    width: 100% !important;
  }

  .cart-img {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
    margin-bottom: 1rem;
  }

  .cart-item-box .flex-grow-1 {
    width: 100%;
  }

  .cart-item-box .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }

  select.form-select {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .price-info {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  button.btn {
    align-self: flex-end;
  }

  .container {
    padding: 1rem;
  }

  .d-flex.justify-content-between.align-items-center {
    flex-direction: column;
    align-items: stretch !important;
    gap: 1rem;
  }

  .d-flex.justify-content-end.mt-3.mb-4 {
    justify-content: center !important;
  }
}

</style>
