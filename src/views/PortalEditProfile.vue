<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'

const router = useRouter()
const username = ref('')
const email = ref('')
const name = ref('')
const dob = ref('')
const errorMessage = ref('')
const loading = ref(true)
const submitting = ref(false)

const loadProfile = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/portal/me')
    username.value = response.data.username
    email.value = response.data.email
    name.value = response.data.name
    dob.value = response.data.dob
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Không tải được hồ sơ'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiClient.patch('/portal/me', { name: name.value, dob: dob.value })
    router.push('/me')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Cập nhật thất bại, vui lòng thử lại!'
  } finally {
    submitting.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div style="max-width: 400px; font-family: sans-serif;">
    <h2>Sửa hồ sơ</h2>

    <div v-if="loading">Đang tải...</div>

    <form v-else @submit.prevent="handleSubmit">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Username:</label>
        <span>{{ username }}</span>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Email:</label>
        <span>{{ email }}</span>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Họ tên:</label>
        <input
          v-model="name"
          type="text"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Ngày sinh:</label>
        <input
          v-model="dob"
          type="date"
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
        {{ submitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
      </button>
    </form>
  </div>
</template>
