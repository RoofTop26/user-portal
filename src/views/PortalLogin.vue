<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref(route.query.message || '')
const submitting = ref(false)

const handleLogin = async () => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const response = await apiClient.post('/portal/login', {
      username: username.value,
      password: password.value
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('role', response.data.role)
    localStorage.setItem('username', response.data.username)

    router.push('/me')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản!'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 80px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif;">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Tài khoản:</label>
        <input
          v-model="username"
          type="text"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Nhập username..."
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mật khẩu:</label>
        <input
          v-model="password"
          type="password"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Nhập password..."
        />
      </div>

      <div v-if="successMessage" style="color: green; margin-bottom: 15px; font-size: 14px;">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="submitting"
        style="width: 100%; padding: 10px; background-color: #42b883; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;"
      >
        {{ submitting ? 'Đang đăng nhập...' : 'Đăng nhập' }}
      </button>
    </form>

    <div style="margin-top: 15px; font-size: 14px; display: flex; justify-content: space-between;">
      <router-link to="/register">Chưa có tài khoản? Đăng ký</router-link>
      <router-link to="/forgot-password">Quên mật khẩu?</router-link>
    </div>
  </div>
</template>
