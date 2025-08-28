<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // ✅ import router
import api from '../api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();
const router = useRouter(); // ✅ initialize router
const cartItems = ref([]);
const loading = ref(false);

// ✅ Fetch selected items on mount
onMounted(async () => {
  try {
    const selectedIds = JSON.parse(sessionStorage.getItem('selectedItems')) || [];

    const cartRes = await api.get('/cart/get-cart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const rawItems = cartRes.data.cart?.cartItems || [];

    const filtered = rawItems.filter(item => selectedIds.includes(item._id));

    const detailedItems = await Promise.all(
      filtered.map(async (item) => {
        const productRes = await api.get(`/products/${item.productId._id}`);
        return {
          ...item,
          productName: productRes.data.name,
          price: productRes.data.price
        };
      })
    );

    cartItems.value = detailedItems;
  } catch (error) {
    console.error('Checkout load error:', error);
    notyf.error('Failed to load checkout data');
  }
});

// ✅ Subtotal for each item
const subtotal = (item) => item.price * item.quantity;

// ✅ Total Calculations
const totalSubtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const tax = computed(() => totalSubtotal.value * 0.12);
const shipping = 200;

const total = computed(() => totalSubtotal.value + tax.value + shipping);

// ✅ Simulated order placement
const placeOrder = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    const selectedItemIds = cartItems.value.map(item => item._id);

    // 1. Create the order
    await api.post('/orders/checkout', {
      items: cartItems.value.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        subtotal: item.subtotal
      })),
      subtotal: totalSubtotal.value,
      tax: tax.value,
      shipping: shipping,
      total: total.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 3. Clear sessionStorage
    sessionStorage.removeItem('selectedItems');

    // 4. Redirect using router
    router.push('/orders'); // or '/orders/my-orders' if that's your route

    notyf.success('Order placed successfully!');
  } catch (error) {
    console.error(error);
    notyf.error('Failed to place order.');
  } finally {
    loading.value = false;
  }
};
</script>


<template>
  <div class="container my-5">
    <h2 class="mb-4">Checkout</h2>

    <div v-if="cartItems.length === 0">
      <p>Your cart is empty or no items selected.</p>
    </div>

    <div v-else>
      <table class="table table-bordered align-middle">
        <thead class="table-light">
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item._id">
            <td>{{ item.productName }}</td>
            <td>₱{{ item.price.toFixed(2) }}</td>
            <td>{{ item.quantity }}</td>
            <td>₱{{ subtotal(item).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- ✅ Summary -->
      <div class="text-end mt-4">
        <p><strong>Subtotal:</strong> ₱{{ totalSubtotal.toFixed(2) }}</p>
        <p><strong>Tax (12%):</strong> ₱{{ tax.toFixed(2) }}</p>
        <p><strong>Shipping Fee:</strong> ₱{{ shipping.toFixed(2) }}</p>
        <h4><strong>Total:</strong> ₱{{ total.toFixed(2) }}</h4>
      </div>

      <!-- ✅ Place Order -->
      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-dark" :disabled="loading" @click="placeOrder">
          {{ loading ? 'Placing Order...' : 'Place Order' }}
        </button>
      </div>
    </div>
  </div>
</template>
