<script setup>
import { ref, onMounted, inject } from 'vue'
import apiClient from '../api.js'

const loadCartCount = inject('loadCartCount')
const cart = ref(null)
const errorMessage = ref('')

const loadCart = async () => {
  const response = await apiClient.get('/portal/cart')
  cart.value = response.data
}

const updateQuantity = async (item) => {
  errorMessage.value = ''
  try {
    await apiClient.put(`/portal/cart/${item.id}`, {
      productId: item.productId,
      quantity: item.quantity
    })
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Cập nhật số lượng thất bại!'
  }
  await loadCart()
  await loadCartCount()
}

const removeItem = async (itemId) => {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    return
  }
  errorMessage.value = ''
  await apiClient.delete(`/portal/cart/${itemId}`)
  await loadCart()
  await loadCartCount()
}

const clearCart = async () => {
  if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
    return
  }
  errorMessage.value = ''
  await apiClient.delete('/portal/cart')
  await loadCart()
  await loadCartCount()
}

onMounted(loadCart)
</script>

<template>
  <div v-if="cart">
    <h2>Giỏ hàng</h2>

    <div v-if="errorMessage" style="color: red; margin-bottom: 15px; font-size: 14px;">
      {{ errorMessage }}
    </div>

    <div v-if="cart.items.length === 0">
      <p>Giỏ hàng trống</p>
      <router-link to="/products">Duyệt sản phẩm</router-link>
    </div>

    <div v-else>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px;">Ảnh</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Tên sản phẩm</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Đơn giá</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Số lượng</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Thành tiền</th>
            <th style="border: 1px solid #ccc; padding: 8px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.id">
            <td style="border: 1px solid #ccc; padding: 8px;">
              <img
                v-if="item.productImageUrl"
                :src="item.productImageUrl"
                style="width: 80px; height: 80px; object-fit: cover;"
              />
              <div v-else style="width: 80px; height: 80px; background-color: #eee;"></div>
            </td>
            <td style="border: 1px solid #ccc; padding: 8px;">{{ item.productName }}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">{{ item.productPrice }}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                @change="updateQuantity(item)"
                style="width: 70px; padding: 6px;"
              />
            </td>
            <td style="border: 1px solid #ccc; padding: 8px;">{{ item.subtotal }}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">
              <button @click="removeItem(item.id)" style="cursor: pointer;">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Tổng tiền: {{ cart.totalAmount }}</h3>
      <button @click="clearCart" style="padding: 8px 16px; cursor: pointer;">Xóa toàn bộ</button>
    </div>
  </div>
</template>
