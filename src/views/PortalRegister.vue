<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const name = ref('')
const dob = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const handleRegister = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await apiClient.post('/portal/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      name: name.value,
      dob: dob.value
    })

    router.push('/login')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Đăng ký thất bại, vui lòng thử lại!'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 60px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif;">
    <h2>Đăng ký</h2>
    <form @submit.prevent="handleRegister">
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
        <label style="display: block; margin-bottom: 5px;">Email:</label>
        <input
          v-model="email"
          type="email"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Nhập email..."
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Mật khẩu:</label>
        <input
          v-model="password"
          type="password"
          minlength="6"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Ít nhất 6 ký tự..."
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Họ tên:</label>
        <input
          v-model="name"
          type="text"
          required
          style="width: 100%; padding: 8px; box-sizing: border-box;"
          placeholder="Nhập họ tên..."
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
        style="width: 100%; padding: 10px; background-color: #42b883; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;"
      >
        {{ submitting ? 'Đang đăng ký...' : 'Đăng ký' }}
      </button>
    </form>

    <div style="margin-top: 15px; font-size: 14px;">
      <router-link to="/login">Đã có tài khoản? Đăng nhập</router-link>
    </div>
  </div>
</template>
