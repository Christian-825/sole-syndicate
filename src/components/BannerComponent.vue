<template>
  <div class="container-fluid">
    <div class="row align-items-center py-5 px-3 px-lg-5" id="banner">
      <div class="col-12 col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
        <h1 class="fw-bold mb-3 display-5" id="banner-title">
          {{ bannerProps.title }}
        </h1>
        <p class="lead mb-4" id="motto">{{ bannerProps.tagline }}</p>
        <router-link
          class="btn custom-banner-btn btn-lg rounded-pill px-4"
          :to="{ name: bannerProps.destination }"
        >
          {{ bannerProps.buttonLabel }} <i class="bi bi-arrow-right"></i>
        </router-link>
      </div>

      <div class="col-12 col-lg-6 text-center">
        <img
          src="../assets/banner1.png"
          alt="Banner Image"
          class="img-fluid"
          style="max-height: 500px; object-fit: contain;"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bannerProps: Object
  }
}
</script>

<style scoped>
#banner {
  background-color: white;
  border-radius: 12px;
}
#banner-title {
  font-family: 'Trebuchet MS', sans-serif;
}
#motto {
  font-family: 'Trebuchet MS', sans-serif;
}
</style>