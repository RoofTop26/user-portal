<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'

const router = useRouter()
const profile = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const loadProfile = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/portal/me')
    profile.value = response.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được hồ sơ'
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('username')
  router.push('/login')
}

onMounted(loadProfile)
</script>

<template>
  <div style="max-width: 500px; font-family: sans-serif;">
    <h2>Hồ sơ của tôi</h2>

    <div v-if="loading">Đang tải...</div>

    <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>

    <div v-if="profile" style="border: 1px solid #ccc; border-radius: 8px; padding: 20px;">
      <p><strong>Username:</strong> {{ profile.username }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>Họ tên:</strong> {{ profile.name }}</p>
      <p><strong>Ngày sinh:</strong> {{ profile.dob }}</p>
      <p><strong>Trạng thái:</strong> {{ profile.status }}</p>
      <p><strong>Ngày tạo:</strong> {{ profile.createdAt }}</p>

      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <router-link to="/me/edit">
          <button style="padding: 8px 16px; cursor: pointer;">Sửa hồ sơ</button>
        </router-link>
        <router-link to="/me/password">
          <button style="padding: 8px 16px; cursor: pointer;">Đổi mật khẩu</button>
        </router-link>
        <button @click="handleLogout" style="padding: 8px 16px; cursor: pointer;">Đăng xuất</button>
      </div>
    </div>
  </div>
</template>
