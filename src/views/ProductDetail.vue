<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const router = useRouter()
const loadCartCount = inject('loadCartCount')
const product = ref(null)
const quantity = ref(1)
const successMessage = ref('')
const errorMessage = ref('')

const handleAddToCart = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!localStorage.getItem('token')) {
    router.push('/login')
    return
  }

  try {
    await apiClient.post('/portal/cart', {
      productId: product.value.id,
      quantity: quantity.value
    })
    successMessage.value = 'Đã thêm'
    await loadCartCount()
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Thêm vào giỏ hàng thất bại!'
  }
}

onMounted(async () => {
  const response = await apiClient.get(`/portal/products/${route.params.id}`)
  product.value = response.data
})
</script>

<template>
  <div v-if="product">
    <img
      v-if="product.imageUrl"
      :src="product.imageUrl"
      style="max-width: 300px;"
    />
    <h2>{{ product.name }}</h2>
    <p>{{ product.description }}</p>
    <p>Giá: {{ product.price }}</p>
    <p>Tồn kho: {{ product.stock }}</p>
    <p>Danh mục: {{ product.categoryName }}</p>
    <div style="margin-bottom: 15px;">
      <label>Số lượng: </label>
      <input
        v-model.number="quantity"
        type="number"
        min="1"
        :max="product.stock"
        :disabled="product.stock === 0"
        style="width: 70px; padding: 6px;"
      />
    </div>
    <button :disabled="product.stock === 0" @click="handleAddToCart">
      {{ product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng' }}
    </button>

    <div v-if="successMessage" style="color: green; margin-top: 15px; font-size: 14px;">
      {{ successMessage }} - <router-link to="/cart">Xem giỏ hàng</router-link>
    </div>
    <div v-if="errorMessage" style="color: red; margin-top: 15px; font-size: 14px;">
      {{ errorMessage }}
    </div>
  </div>
</template>
