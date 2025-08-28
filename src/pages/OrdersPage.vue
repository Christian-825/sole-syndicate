<template>
  <div class="container my-5">
    <h2 class="mb-4">My Orders</h2>

    <div v-if="orders.length === 0">
      <p>You haven't placed any orders yet.</p>
    </div>

    <div v-else>
      <div class="row justify-content-center" v-for="order in orders" :key="order._id">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card mb-3 p-2 shadow-sm small" style="font-size: 0.9rem;">
            <div class="card-header">
              Order #{{ order._id }} — {{ formatDate(order.orderedOn) }}
            </div>

            <ul class="list-group list-group-flush">
              <li v-for="item in order.items" :key="item.productId"
                class="list-group-item d-flex justify-content-between">
                <div>
                  <strong>{{ item.productName }}</strong> (x{{ item.quantity }}) - Size: {{ item.size }}
                </div>
                <div>₱{{ (item.price * item.quantity).toFixed(2) }}</div>
              </li>
            </ul>

            <div class="card-footer">
              <div class="row text-muted">
                <div class="col-12 mx-auto">
                  <div class="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>₱{{ (order.subtotal ?? 0).toFixed(2) }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Tax (12%):</span>
                    <span>₱{{ (order.tax ?? 0).toFixed(2) }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Shipping:</span>
                    <span>₱{{ (order.shipping ?? 0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="badge" :class="order.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'">
                  Status: {{ order.status }}
                </span>

                <span class="fw-bold">
                  Total: ₱{{ (order.total ?? 0).toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();
const orders = ref([]);

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await api.get('/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    orders.value = data.orders;
  } catch (error) {
    console.error('Fetch orders error:', error);
    notyf.error('Failed to load orders');
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(fetchOrders);
</script>
