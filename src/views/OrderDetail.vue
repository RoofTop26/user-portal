<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '../api.js'
import { formatPrice } from '../utils/format.js'

const route = useRoute()
const order = ref(null)

const loadOrder = async () => {
  const response = await apiClient.get(`/portal/orders/${route.params.id}`)
  order.value = response.data
}

const cancelOrder = async () => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
    return
  }
  await apiClient.post(`/portal/orders/${order.value.id}/cancel`)
  await loadOrder()
}

const statusColor = (status) => {
  if (status === 'PENDING') return '#f0ad4e'
  if (status === 'CONFIRMED') return '#28a745'
  return '#dc3545'
}

onMounted(loadOrder)
</script>

<template>
  <div v-if="order">
    <h2>Đơn hàng #{{ order.id }}</h2>

    <p>
      Trạng thái:
      <span :style="{ backgroundColor: statusColor(order.status), color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }">
        {{ order.status }}
      </span>
    </p>
    <p>Ngày đặt: {{ new Date(order.createdAt).toLocaleString('vi-VN') }}</p>
    <p>Ghi chú: {{ order.note }}</p>

    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ccc; padding: 8px;">Tên sản phẩm</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Giá lúc đặt</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Số lượng</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.items" :key="item.productId">
          <td style="border: 1px solid #ccc; padding: 8px;">{{ item.productName }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">{{ formatPrice(item.price) }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">{{ item.quantity }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">{{ formatPrice(item.subtotal) }}</td>
        </tr>
      </tbody>
    </table>

    <h3>Tổng tiền: {{ formatPrice(order.totalAmount) }}</h3>

    <button v-if="order.status === 'PENDING'" @click="cancelOrder" style="padding: 8px 16px; cursor: pointer;">Hủy đơn</button>
  </div>
</template>
