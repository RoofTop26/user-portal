<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const router = useRouter()
const token = route.query.token || ''

const newPassword = ref('')
const confirmNewPassword = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''

  if (newPassword.value !== confirmNewPassword.value) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  submitting.value = true
  try {
    await apiClient.post('/portal/reset-password', {
      token,
      newPassword: newPassword.value
    })

    router.push({ path: '/login', query: { message: 'Đặt lại mật khẩu thành công' } })
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Token không hợp lệ hoặc đã hết hạn'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 80px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif;">
    <h2>Đặt lại mật khẩu</h2>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mật khẩu mới:</label>
        <input
          v-model="newPassword"
          type="password"
          minlength="6"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Ít nhất 6 ký tự..."
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Xác nhận mật khẩu mới:</label>
        <input
          v-model="confirmNewPassword"
          type="password"
          minlength="6"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Nhập lại mật khẩu mới..."
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
        {{ submitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu' }}
      </button>
    </form>
  </div>
</template>
