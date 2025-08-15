<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
  <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <h2 class="text-2xl font-bold mb-6">Giỏ Hàng Của Bạn</h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sản phẩm trong giỏ -->
      <div class="lg:col-span-2" v-if="cart.length > 0">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Sản Phẩm Trong Giỏ ({{ cart.length }})</h3>
          <button
            class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 cursor-pointer"
            @click="clearCart"
          >
            Xóa giỏ hàng
          </button>
        </div>

        <div
          v-for="(item, index) in cart"
          :key="item._id"
          class="flex items-center justify-between border-b py-4"
        >
          <div class="flex items-center space-x-4">
            <img
              :src="`http://localhost:4000/uploads/product/${item.product?.images[0]}`"
              alt="Product Image"
              class="w-20 h-20 object-cover rounded"
            />
            <div>
              <h4 class="font-medium">{{ item.product?.name || item.name }}</h4>
              <p class="text-gray-600 text-sm">Size: {{ item.size || 'N/A' }}</p>
              <p class="text-gray-600 text-sm">Màu: {{ item.color || 'N/A' }}</p>
              <p class="text-gray-600 text-sm">{{ formatPrice(item.price) }} mỗi sản phẩm</p>
              <div class="flex items-center border rounded overflow-hidden w-fit mt-1">
                <button
                    class="w-8 h-8 flex items-center justify-center border-r hover:bg-gray-100 text-sm"
                    @click="decreaseQty(index)"
                >-</button>
                <input
                    type="text"
                    v-model.number="item.quantity"
                    class="w-10 h-8 text-center outline-none text-sm"
                    readonly
                />
                <button
                    class="w-8 h-8 flex items-center justify-center border-l hover:bg-gray-100 text-sm"
                    @click="increaseQty(index)"
                >+</button>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <p class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</p>
            <button @click="removeItem(index)" class="text-gray-500 hover:text-red-500 mt-2">🗑</button>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 col-span-full">
        Giỏ hàng của bạn đang trống.
      </div>

      <!-- Tóm tắt đơn hàng -->
      <div class="border rounded-lg p-6 h-fit" v-if="cart.length > 0">
        <h3 class="text-lg font-semibold mb-4">Tóm Tắt Đơn Hàng</h3>
        <div class="flex justify-between text-sm mb-2">
          <span>Tạm tính</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm mb-2">
          <span>Phí vận chuyển</span>
          <span>Miễn phí</span>
        </div>
        
        <hr class="my-3" />
        <div class="flex justify-between font-semibold text-lg mb-6">
          <span>Tổng cộng</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
        <button
          class="w-full bg-emerald-500 text-white py-3 rounded hover:bg-emerald-600 cursor-pointer"
        >
          → Tiến Hành Thanh Toán
        </button>
        <button
          class="w-full text-red-500 mt-3 cursor-pointer"
          @click="goShopping"
        >
          Tiếp Tục Mua Sắm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Alert from '@/components/Alert/ComAlert.vue';


const router = useRouter()
const cart = ref([])

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
  if (!value) return '0đ'
  return value.toLocaleString('vi-VN') + 'đ'
}

// Gọi API để hiển thị sản phẩm trong giỏ hàng
const fetchCart = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    const res = await axios.get('http://localhost:4000/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.data.success && res.data.cart) {
      // Mảng items chứa các sản phẩm trong giỏ hàng
      cart.value = res.data.cart.items.map(item => ({
        ...item,
        name: item.product?.name || '',
        image: item.image || (item.product?.images ? item.product.images[0] : ''),
        price: item.price || (item.product?.price || 0)
      }))
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.')
  }
}

// Tính tổng tiền trong giỏ hàng (chưa tính phí ship, giảm giá)
const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
// Tổng tiền cuối cùng (hiện tại = subtotal, sau này có thể cộng phí ship/thuế)
const total = computed(() => subtotal.value)

// Gọi API để cập nhật số lượng sản phẩm trong giỏ hàng
const updateQty = async (index, quantity) => {
  const item = cart.value[index]
  try {
    const res = await axios.put(
      'http://localhost:4000/api/cart/update',
      {
        productId: item.product._id || item.product,
        quantity,
        size: item.size,
        color: item.color
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (res.data.success) {
      cart.value = res.data.cart.items.map(item => ({
        ...item,
        name: item.product?.name || '',
        image: item.image || (item.product?.images ? item.product.images[0] : ''),
        price: item.price || (item.product?.price || 0)
      }))
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể cập nhật giỏ hàng.')
  }
}

// Hàm tăng số lượng sản phẩm
const increaseQty = (index) => {
   const newQty = cart.value[index].quantity + 1
  updateQty(index, newQty)
}

// Hàm giảm số lượng sản phẩm
const decreaseQty = (index) => {
  const newQty = cart.value[index].quantity - 1
  if (newQty >= 1) {
    updateQty(index, newQty)
  } else {
    // Nếu muốn xoá khi còn 1 rồi nhấn trừ
    removeItem(index)
  }
}

// Gọi API để xóa 1 sản phẩm khỏi giỏ hàng
const removeItem = async (index) => {
  try {
    const item = cart.value[index]
    const res = await axios.delete('http://localhost:4000/api/cart/remove', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: {
        productId: item.product._id || item.product,
        size: item.size,
        color: item.color
      }
    })

    if (res.data.success) {
      showToast('success', 'Thành công', res.data.message)
      // Cập nhật lại cart từ backend
      if (res.data.cart && res.data.cart.items) {
        cart.value = res.data.cart.items.map(item => ({
          ...item,
          name: item.product?.name || '',
          image: item.image || (item.product?.images ? item.product.images[0] : ''),
          price: item.price || (item.product?.price || 0)
        }))
      } else {
        // Nếu giỏ hàng trống sau xóa, set cart rỗng
        cart.value = []
      }
    } else {
      showToast('error', 'Lỗi', res.data.error || 'Xóa sản phẩm thất bại')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể xóa sản phẩm khỏi giỏ hàng.')
  }
}

// Gọi APi để xóa toàn bộ SP trong giỏ hàng
const clearCart = async() => {
  try {
    const res = await axios.delete('http://localhost:4000/api/cart/clear', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
      showToast('success', 'Thành công', res.data.message)
      cart.value = [] // Xóa giỏ hàng trong state
    } else {
      showToast('error', 'Lỗi', res.data.error || 'Không thể xóa giỏ hàng.')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể xóa sản phẩm khỏi giỏ hàng.')
  }
}

const goShopping = () => {
  router.push('/shop')
}

onMounted(() => {
  fetchCart()
})
</script>
