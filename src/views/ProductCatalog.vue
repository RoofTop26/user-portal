<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../api.js'

const route = useRoute()
const router = useRouter()
const products = ref([])
const categories = ref([])
const selectedCategory = ref(route.query.category || '')

const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return products.value
  }
  return products.value.filter(p => String(p.categoryId) === String(selectedCategory.value))
})

onMounted(async () => {
  const productResponse = await apiClient.get('/portal/products')
  products.value = productResponse.data
  const categoryResponse = await apiClient.get('/portal/categories')
  categories.value = categoryResponse.data
})
</script>

<template>
  <div>
    <select v-model="selectedCategory">
      <option value="">Tất cả</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-top: 20px;">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        @click="router.push(`/products/${product.id}`)"
        style="border: 1px solid #ccc; padding: 12px; cursor: pointer;"
      >
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          style="width: 100%; height: 160px; object-fit: cover;"
        />
        <div v-else style="width: 100%; height: 160px; background-color: #eee;"></div>
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }}</p>
        <p>{{ product.categoryName }}</p>
      </div>
    </div>
  </div>
</template>
