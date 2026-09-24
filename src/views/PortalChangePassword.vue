<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'

const router = useRouter()
const oldPassword = ref('')
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
    await apiClient.patch('/portal/me/password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })
    router.push('/me')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Đổi mật khẩu thất bại!'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px; font-family: sans-serif;">
    <h2>Đổi mật khẩu</h2>

    <form @submit.prevent="handleSubmit">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mật khẩu hiện tại:</label>
        <input
          v-model="oldPassword"
          type="password"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mật khẩu mới:</label>
        <input
          v-model="newPassword"
          type="password"
          minlength="6"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
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
        />
      </div>

      <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="submitting"
        style="padding: 10px 20px; background-color: #42b883; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        {{ submitting ? 'Đang lưu...' : 'Đổi mật khẩu' }}
      </button>
    </form>
  </div>
</template>
