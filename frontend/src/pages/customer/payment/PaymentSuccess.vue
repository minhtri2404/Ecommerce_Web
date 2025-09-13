<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <h2 class="text-2xl font-bold mb-4">Thanh toán thành công!</h2>
    <p>Đang chuyển hướng tới trang Đơn hàng của tôi...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const orderId = route.query.orderId
const resultCode = route.query.resultCode

const PaymentSuccess = async() => {
    if (resultCode === '0' && orderId) {
        // Cập nhật trạng thái thanh toán tại backend (IPN cũng nên xử lý, nhưng đây là check thêm)
        try {
            const res = await axios.post(`http://localhost:4000/api/payment/notify`, {
                orderId: orderId, resultCode: resultCode
            })
            if (res.data.success) {
                setTimeout(() => {
                    router.push('/my-orders')
                }, 2000)
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái thanh toán:', error)
        }
    }
}

onMounted(PaymentSuccess)

</script>
