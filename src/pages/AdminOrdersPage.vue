<template>
  <div class="container my-5">
    <h2 class="mb-4 text-center">All User Orders</h2>

    <div v-if="orders.length === 0">
      <p class="text-center">No orders found.</p>
    </div>

    <div v-else>
      <div class="row justify-content-center" v-for="order in orders" :key="order._id">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card mb-3 p-2 shadow-sm small" style="font-size: 0.9rem;">
            <div class="card-header d-flex flex-column">
              <div>
                <strong>Order #{{ order._id }}</strong>
                — {{ formatDate(order.orderedOn) }}
              </div>
              <div class="text-muted mt-1">
                <small>User: {{ order.userId.email }} ({{ order.userId._id }})</small>
              </div>
            </div>

            <ul class="list-group list-group-flush">
              <li v-for="item in order.items" :key="item._id" class="list-group-item d-flex justify-content-between">
                <div>
                  <strong>{{ item.productName }}</strong>
                  (x{{ item.quantity }}) - Size: {{ item.size }}
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

              <div class="d-flex justify-content-end gap-2 mt-3">
                <button class="btn btn-sm btn-dark w-50" @click="deleteOrder(order._id)">
                  Delete
                </button>
                <button class="btn btn-sm btn-outline-dark w-50" :disabled="order.status === 'completed'"
                  @click="updateOrderStatus(order._id)">
                  Mark Completed
                </button>
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

const orders = ref([]);
const notyf = new Notyf();

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await api.get('/orders/all-orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    orders.value = data.orders;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    notyf.error('Failed to load orders');
  }
};

const deleteOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    await api.delete(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    orders.value = orders.value.filter((order) => order._id !== orderId);
    notyf.success('Order deleted');
  } catch (error) {
    console.error('Delete error:', error);
    notyf.error('Failed to delete order');
  }
};

const updateOrderStatus = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await api.patch(
      `/orders/${orderId}`,
      { status: 'completed' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updated = data.order;
    const index = orders.value.findIndex((order) => order._id === orderId);
    if (index !== -1) {
      orders.value[index] = updated;
    }
    notyf.success('Order marked as completed');
  } catch (error) {
    console.error('Update status error:', error);
    notyf.error('Failed to update order status');
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
