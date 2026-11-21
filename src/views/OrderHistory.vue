<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api.js'
import { formatPrice } from '../utils/format.js'

const router = useRouter()
const orders = ref(null)

const loadOrders = async () => {
  const response = await apiClient.get('/portal/orders')
  orders.value = response.data
}

const statusColor = (status) => {
  if (status === 'PENDING') return '#f0ad4e'
  if (status === 'CONFIRMED') return '#28a745'
  return '#dc3545'
}

onMounted(loadOrders)
</script>

<template>
  <div v-if="orders">
    <h2>Đơn hàng của tôi</h2>

    <p v-if="orders.length === 0">Chưa có đơn hàng</p>

    <table v-else style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ccc; padding: 8px;">ID</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Ngày đặt</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Tổng tiền</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
          @click="router.push('/orders/' + order.id)"
          style="cursor: pointer;"
        >
          <td style="border: 1px solid #ccc; padding: 8px;">{{ order.id }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">{{ new Date(order.createdAt).toLocaleString('vi-VN') }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">{{ formatPrice(order.totalAmount) }}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">
            <span :style="{ backgroundColor: statusColor(order.status), color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }">
              {{ order.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
