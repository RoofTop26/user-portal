<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'
import { formatPrice } from '../utils/format.js'

const router = useRouter()
const cart = ref(null)
const note = ref('')
const errorMessage = ref('')

const loadCart = async () => {
  const response = await apiClient.get('/portal/cart')
  cart.value = response.data
  if (cart.value.items.length === 0) {
    router.push('/products')
  }
}

const handleCheckout = async () => {
  errorMessage.value = ''
  try {
    const response = await apiClient.post('/portal/checkout', {
      note: note.value
    })
    router.push(`/orders/${response.data.id}`)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Đặt hàng thất bại!'
  }
}

onMounted(loadCart)
</script>

<template>
  <div v-if="cart">
    <h2>Thanh toán</h2>

    <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">
      {{ errorMessage }}
    </div>

    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ccc; padding: 8px;">Tên sản phẩm</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Đơn giá</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Số lượng</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cart.items" :key="item.id">
          <td style="border: 1px solid #ccc; padding: 8px;">{{ item.productName }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">{{ formatPrice(item.productPrice) }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">{{ item.quantity }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">{{ formatPrice(item.subtotal) }}</td>
        </tr>
      </tbody>
    </table>

    <h3>Tổng tiền: {{ formatPrice(cart.totalAmount) }}</h3>

    <div style="margin-bottom: 15px;">
      <label>Ghi chú: </label>
      <input v-model="note" type="text" style="width: 300px; padding: 6px;" />
    </div>

    <button @click="handleCheckout" style="padding: 8px 16px; cursor: pointer;">Đặt hàng</button>
  </div>
</template>
