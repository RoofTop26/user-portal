<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'

const router = useRouter()
const categories = ref([])

onMounted(async () => {
  const response = await apiClient.get('/portal/categories')
  categories.value = response.data
})
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
    <div
      v-for="category in categories"
      :key="category.id"
      @click="router.push(`/products?category=${category.id}`)"
      style="border: 1px solid #ccc; padding: 16px; cursor: pointer;"
    >
      <h3>{{ category.name }}</h3>
    </div>
  </div>
</template>
