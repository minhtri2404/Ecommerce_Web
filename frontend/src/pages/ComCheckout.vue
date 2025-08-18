<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Thông tin giao hàng -->
      <div class="bg-white p-6 rounded-2xl shadow">
        <h2 class="text-2xl font-semibold mb-6">Thanh Toán</h2>
        <form class="space-y-4">
          <!-- Họ và tên -->
          <div>
            <label class="block text-sm font-medium mb-1">Họ và Tên</label>
            <input v-model="form.fullName" type="text" class="w-full border rounded-lg p-2" />
          </div>

          <!-- SĐT -->
          <div>
            <label class="block text-sm font-medium mb-1">Số Điện Thoại</label>
            <input v-model="form.phone" type="text" class="w-full border rounded-lg p-2" />
          </div>

          <!-- Địa chỉ -->
          <div>
            <label class="block text-sm font-medium mb-1">Địa Chỉ</label>
            <input v-model="form.address" type="text" class="w-full border rounded-lg p-2" />
          </div>

          <!-- Thành phố + Tỉnh -->
          <div>
            <label class="block text-sm font-medium mb-1">Thành phố </label>
            <input v-model="form.city" type="text" class="w-full border rounded-lg p-2" />
          </div>

          <!-- Quốc gia -->
          <div>
            <label class="block text-sm font-medium mb-1">Quốc Gia</label>
            <select v-model="form.country" class="w-full border rounded-lg p-2">
              <option>Việt Nam</option>
              <option>Mỹ</option>
              <option>Nhật Bản</option>
            </select>
          </div>

          <!-- Phương thức thanh toán -->
          <div>
            <label class="block text-sm font-medium mb-2">Phương thức thanh toán</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="radio" v-model="form.paymentMethod" value="cod" />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" v-model="form.paymentMethod" value="credit" />
                <span>Thẻ tín dụng</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Tóm tắt đơn hàng -->
      <div class="bg-white p-6 rounded-2xl shadow">
        <h2 class="text-2xl font-semibold mb-6">Tóm Tắt Đơn Hàng</h2>

        <!-- Danh sách sản phẩm -->
        <div v-if="cart.length > 0">
          <div
            v-for="item in cart"
            :key="item._id"
            class="flex items-center gap-4 mb-6"
          >
            <img
              :src="`http://localhost:4000/uploads/product/${item.image}`"
              alt="Product"
              class="w-20 h-20 rounded-lg object-cover"
            >
            <div>
              <h3 class="font-semibold">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">Size: {{ item.size || 'N/A' }} - Màu: {{ item.color || 'N/A' }}</p>
              <p class="font-medium">{{ formatPrice(item.price) }} x {{ item.quantity }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500">Giỏ hàng trống</div>

        <!-- Mã giảm giá -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Mã giảm giá</label>
          <div class="flex gap-2">
            <input v-model="discountCode" type="text" placeholder="Nhập mã giảm giá"
                   class="flex-1 border rounded-lg p-2" />
            <button @click.prevent="applyDiscount"
                    class="bg-indigo-500 text-white px-4 rounded-lg hover:bg-indigo-600">
              Áp dụng
            </button>
          </div>
        </div>

        <!-- Giá tiền -->
        <div class="space-y-2 text-gray-600">
          <div class="flex justify-between">
            <span>Tạm tính</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>

           <div class="flex justify-between" v-if="discountAmount > 0">
            <span>Giảm giá</span>
            <span>-{{ formatPrice(discountAmount) }}</span>
          </div>

          <div class="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
        </div>

        <div class="border-t mt-4 pt-4 flex justify-between font-semibold text-lg">
          <span>Tổng cộng</span>
          <span>{{ formatPrice(total) }}</span>
        </div>

        <button
          @click="handleCheckout"
          class="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Tiến hành thanh toán
        </button>

        <div class="mt-4 text-sm text-gray-500 text-center">
          Thanh toán an toàn. Thông tin của bạn được xử lý an toàn.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"
import Alert from '@/components/Alert/ComAlert.vue';


const router = useRouter()
const cart = ref([])

const form = ref({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  cityState: "",
  country: "Việt Nam",
  paymentMethod: "cod",
})

const discountCode = ref("")
const discountAmount = ref(0) // demo
// ALERT state
const showAlert = ref(false);
const alertType = ref('success'); // success | error
const alertTitle = ref('');
const alertMessage = ref('');

const showToast = (type, title, message) => {
  alertType.value = type;
  alertTitle.value = title;
  alertMessage.value = message;
  showAlert.value = true;
}



const formatPrice = (value) => {
  if (!value) return "0đ"
  return value.toLocaleString("vi-VN") + "đ"
}

// Fetch giỏ hàng từ API
const fetchCart = async () => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    const res = await axios.get("http://localhost:4000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.data.success && res.data.cart) {
      cart.value = res.data.cart.items.map(item => ({
        ...item,
        name: item.product?.name || "",
        image: item.image || (item.product?.images ? item.product.images[0] : ""),
        price: item.price || (item.product?.price || 0)
      }))
    }
  } catch (error) {
    console.error("Lỗi fetchCart:", error)
  }
}

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

// Tính lại total = subtotal - discountAmount
const total = computed(() => subtotal.value - discountAmount.value)

const applyDiscount = () => {
  if (!discountCode.value) {
    showToast('error', 'Lỗi', 'Vui lòng nhập mã giảm giá!')
    return
  }

  if (discountCode.value === "SALE20") {
    discountAmount.value = subtotal.value * 0.2
    showToast('success', 'Thành công', `Áp dụng mã SALE20: Giảm ${formatPrice(discountAmount.value)}`)
  } else {
    discountAmount.value = 0
    showToast('error', 'Lỗi', 'Mã giảm giá không hợp lệ')
  }
}


// Gọi API để tạo đơn hàng
const handleCheckout = async() => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    const formData = {
      shippingAddress: {
        fullName: form.value.fullName,
        phone: form.value.phone,
        address: form.value.address,
        city: form.value.city,
        country: form.value.country,
      },
      paymentMethod: form.value.paymentMethod,
      discountCode: discountCode.value || null,
      discountAmount: discountAmount.value
    }

    const res = await axios.post("http://localhost:4000/api/orders/create", formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.data.success) {
      showToast('success', 'Thành công', res.data.message)
        setTimeout(() => {
        router.push('/my-orders')
      }, 2000)
    } else{
      showToast('error', 'Lỗi', res.data.message || 'Đã xảy ra lỗi khi tạo đơn hàng')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Đã xảy ra lỗi khi tạo đơn hàng')
  }
}


onMounted(() => {
  fetchCart()
})
</script>
