<script setup>
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';

const { resetUser } = useGlobalStore();
const router = useRouter();

resetUser();
router.push('/login');
</script>

<template>
  <div class="text-center p-4">
    Logging out...
  </div>
</template>
