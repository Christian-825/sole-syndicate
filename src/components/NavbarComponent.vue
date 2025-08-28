<script setup>
import { ref } from 'vue';
import { useGlobalStore } from '../stores/global';

const store = useGlobalStore();
const email = ref("");
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top bg-light shadow-sm">
    <div class="container">
      <!-- Logo -->
      <router-link :to="{ name: 'Home' }" class="navbar-brand d-flex align-items-center gap-2 text-dark fw-bold fs-3">
        <img src="../assets/logo.png" alt="Logo" width="50" height="50" />
        Sole Syndicate&#8482;
      </router-link>

      <!-- Toggler button for mobile -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapsible nav links -->
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto text-dark fw-bold fs-5">

          <!-- Admin only visible -->
          <router-link v-if="store.user.isAdmin" :to="{ name: 'Products' }" class="nav-link">
            ADMIN DASHBOARD
          </router-link>

          <!-- Always visible -->
          <router-link :to="{ name: 'ProductsCatalog' }" class="nav-link">PRODUCT CATALOG</router-link>

          <!-- When logged in -->
          <template v-if="store.user && store.user.email">

            <!-- Visible only to non-admin users -->
            <template v-if="!store.user.isAdmin">
              <router-link :to="{ name: 'Cart' }" class="nav-link">CART</router-link>
              <router-link :to="{ name: 'Orders' }" class="nav-link">ORDERS</router-link>
            </template>

            <!-- Separator -->
            <div class="vr mx-3"></div>

            <router-link :to="{ name: 'Profile' }" class="nav-link">MY ACCOUNT</router-link>
            <router-link :to="{ name: 'Logout' }" class="nav-link">LOGOUT</router-link>
          </template>

          <!-- When logged out -->
          <template v-else>
            <div class="vr mx-3"></div>
            <router-link :to="{ name: 'Register' }" class="nav-link">REGISTER</router-link>
            <router-link :to="{ name: 'Login' }" class="nav-link">LOGIN</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>


<style scoped>
/* Optional: Enable hover for dropdown menus if needed */
/*
.navbar .dropdown:hover .dropdown-menu {
  display: block;
}
*/
</style>
