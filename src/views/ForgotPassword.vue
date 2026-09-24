<script setup>
import { ref } from 'vue'
import apiClient from '../api.js'

const email = ref('')
const errorMessage = ref('')
const submitted = ref(false)
const submitting = ref(false)

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiClient.post('/portal/forgot-password', { email: email.value })
    submitted.value = true
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại!'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 80px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif;">
    <h2>Quên mật khẩu</h2>

    <div v-if="submitted">
      <p>Kiểm tra email của bạn</p>
      <router-link to="/login">Quay lại đăng nhập</router-link>
    </div>

    <form v-else @submit.prevent="handleSubmit">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Email:</label>
        <input
          v-model="email"
          type="email"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Nhập email đã đăng ký..."
        />
      </div>

      <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="submitting"
        style="width: 100%; padding: 10px; background-color: #42b883; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;"
      >
        {{ submitting ? 'Đang gửi...' : 'Gửi yêu cầu' }}
      </button>

      <div style="margin-top: 15px; font-size: 14px;">
        <router-link to="/login">Quay lại đăng nhập</router-link>
      </div>
    </form>
  </div>
</template>
