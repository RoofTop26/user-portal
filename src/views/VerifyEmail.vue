<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const token = route.query.token || ''

const success = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    await apiClient.post('/portal/verify-email', { token })
    success.value = true
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Token không hợp lệ hoặc đã hết hạn'
  }
})
</script>

<template>
  <div style="max-width: 400px; margin: 80px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif;">
    <div v-if="success">
      <div style="color: green; margin-bottom: 15px; font-size: 14px;">
        Tài khoản đã kích hoạt!
      </div>
      <router-link to="/login">Đăng nhập</router-link>
    </div>

    <div v-if="errorMessage" style="color: red; font-size: 14px;">
      {{ errorMessage }}
    </div>
  </div>
</template>
