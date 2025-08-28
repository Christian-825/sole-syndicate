<!-- 
  What is a component? 
    A component is a reusable part of an application.

  What is a VueJS Component?
    A VueJS component is an independent reusable part of an application. In VueJS, components are usually created with the concept of Single-File Component (SFC) which simply means that in VueJS, a component holds the HTML code, JS Script and CSS altogether in a file with a .vue extension instead of having and keeping separate files for each.
An SFC consists of three parts:
    1. Template
    2. Script
    3. Style

  This provides a convenient way to organize and reuse components in a declarative and modular way. They also allow for better separation of concerns, making it easier to reason about the functionality and styling of a component
-->
<!-- Each SFC block consists of HTML-like tags that encapsulates the block. They can be in any order. -->

<!-- Script: A block of JavaScript code that defines the behavior and logic of the component. -->

<script setup>
import NavbarComponent from './components/NavbarComponent.vue';
import { useGlobalStore } from './stores/global';
import { onBeforeMount } from 'vue';

const store = useGlobalStore();

onBeforeMount(() => {
  const token = localStorage.getItem("token");
  if (token) {
    store.getUserDetails(token);
  }
});
</script>

<!-- Template: A block of HTML-like code that defines the structure of the component. -->
<template>
  <NavbarComponent />
  <!-- 
        <router-view> is a Vue Router component that is used to display the component associated with the current route.

        When a user navigates to a different route, Vue Router displays the component associated with the route inside the <router-view> component. 
    -->
  <router-view />
</template>




<!-- Style: A block of CSS code that defines the styling of the component. -->
<style scoped>

</style>
