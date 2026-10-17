<script setup>
import { ref, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'

const router = useRouter()
const username = localStorage.getItem('username')
const isLoggedIn = !!localStorage.getItem('token')
const cartCount = ref(0)

const loadCartCount = async () => {
  if (!isLoggedIn) {
    return
  }
  const response = await apiClient.get('/portal/cart')
  cartCount.value = response.data.items.length
}

provide('loadCartCount', loadCartCount)

onMounted(loadCartCount)

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<template>
  <div>
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background-color: #42b883; color: white;">
      <div style="display: flex; gap: 25px; align-items: center;">
        <router-link to="/me" style="color: white; font-weight: bold; text-decoration: none;">User Portal</router-link>
        <router-link to="/products" style="color: white; text-decoration: none;">Sản phẩm</router-link>
        <router-link to="/categories" style="color: white; text-decoration: none;">Danh mục</router-link>
      </div>
      <div v-if="isLoggedIn" style="display: flex; gap: 15px; align-items: center;">
        <router-link to="/cart" style="color: white; text-decoration: none;">
          Giỏ hàng
          <span style="background-color: red; color: white; border-radius: 10px; padding: 2px 8px; font-size: 12px;">{{ cartCount }}</span>
        </router-link>
        <span>{{ username }}</span>
        <button @click="handleLogout" style="padding: 6px 14px; cursor: pointer;">Đăng xuất</button>
      </div>
      <div v-else style="display: flex; gap: 15px; align-items: center;">
        <router-link to="/login" style="color: white; text-decoration: none;">Đăng nhập</router-link>
        <router-link to="/register" style="color: white; text-decoration: none;">Đăng ký</router-link>
      </div>
    </nav>
    <div style="padding: 30px;">
      <router-view />
    </div>
  </div>
</template>
