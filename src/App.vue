<template>
  <a-config-provider>
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  // Check if user is logged in
  const token = localStorage.getItem('admin_token')
  if (!token && route.meta.requiresAuth) {
    router.push('/login')
  }
})
</script>
