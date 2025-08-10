<template>
  <div class="max-w-6xl w-full px-6 mx-auto">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />

    <!-- Breadcrumb -->
    <p class="text-sm text-gray-600">
      <span>Home</span> / 
      <span>Products</span> / 
      <span>{{ product.category?.categoryName}}</span> / 
      <span>{{ product.name }}</span>
    </p>

    <div class="flex flex-col md:flex-row gap-8 mt-4">
      <!-- Left: Images -->
      <div class="md:w-1/2">
        <!-- Main Image -->
        <div class="border border-gray-300 rounded overflow-hidden">
          <img
            v-if="mainImage"
            :src="mainImage"
            :alt="product.name"
            class="w-full h-[400px] object-cover"
          />
        </div>

        <!-- Thumbnails -->
        <div class="flex gap-3 mt-3">
          <div
            v-for="(image, index) in product.images"
            :key="index"
            @click="mainImage = getImageUrl(image)"
            class="border border-gray-300 rounded overflow-hidden cursor-pointer"
            :class="mainImage === getImageUrl(image) ? 'ring-2 ring-indigo-500' : ''"
          >
            <img
              :src="getImageUrl(image)"
              :alt="`Ảnh ${index + 1}`"
              class="w-20 h-20 object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Right: Product Info -->
      <div class="md:w-1/2 text-base space-y-4">
        <!-- Name + Price -->
        <h1 class="text-3xl font-semibold">{{ product.name }}</h1>
        <div class="flex items-center gap-4">
          <p class="text-2xl font-bold text-red-500">{{ formatCurrency(product.price) }}</p>
        </div>

        <!-- Status + Stock -->
        <div class="flex items-center gap-4">
          <span class="text-green-600 font-medium">Còn hàng</span>
          <span class="text-orange-500">Chỉ còn {{ product.quantity }} sản phẩm</span>
        </div>

        <!-- Description -->
        <p class="text-gray-700">{{ product.description }}</p>

        <!-- Size -->
        <div v-if="product.sizes?.length">
          <p class="font-medium mb-1">Chọn Size</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="size in product.sizes"
              :key="size"
              @click="selectedSize = size"
              class="px-4 py-2 border rounded"
              :class="selectedSize === size ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Colors -->
        <div v-if="product.colors?.length">
          <p class="font-medium mb-1">Màu sắc</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="color in product.colors"
              :key="color"
              @click="selectedColor = color"
              class="px-4 py-1 border rounded"
              :class="selectedColor === color ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- Quantity -->
        <div>
          <p class="font-medium mb-1">Số lượng</p>
          <div class="flex items-center gap-3">
            <button class="px-3 py-1 border rounded" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
            <span>{{ quantity }}</span>
            <button class="px-3 py-1 border rounded" @click="increaseQuantity">+</button>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 pt-4">
          <button
            @click="addToCart"
            class="flex-1 py-3 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          >
            Thêm Vào Giỏ
          </button>
          <button
            @click="buyNow"
            class="flex-1 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Mua Ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const product = ref({ images: [], sizes: [], colors: [] })
const mainImage = ref('')
const selectedSize = ref('')
const selectedColor = ref('')
const quantity = ref(1)

const showAlert = ref(false)
const alertType = ref('success')
const alertTitle = ref('')
const alertMessage = ref('')

const showToast = (type, title, message) => {
  alertType.value = type
  alertTitle.value = title
  alertMessage.value = message
  showAlert.value = true
}

const getImageUrl = (filename) => {
  return `http://localhost:4000/uploads/product/${filename}`
}

// Gọi API để lấy thông tin chi tiết của sản phẩm
const fetchProduct = async () => {
  try {
    const res = await axios.get(`http://localhost:4000/api/products/${id}`)
    if (res.data.success) {
      product.value = res.data.product
      if (product.value.images.length) {
        mainImage.value = getImageUrl(product.value.images[0])
      }
    } else {
      showToast('error', 'Lỗi', res.data.message)
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.')
  }
}

const increaseQuantity = () => quantity.value++
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

// Thêm sản phẩm vào giỏ hàng
const addToCart = () => {
  // Kiểm tra đăng nhập
  const token = localStorage.getItem('token')
  if (!token) {
    showToast('error', 'Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    return
  } 

  // Kiểm tra size + màu
  if (!selectedSize.value || !selectedColor.value) {
    showToast('error', 'Lỗi', 'Vui lòng chọn phiên bản và màu sắc')
    return
  }

  // Kiểm tra số lượng// Nếu đã đăng nhập thì thực hiện thêm vào giỏ
  showToast('success', 'Thành công', 'Thêm thành công vào giỏ hàng');
  setTimeout(() => {
    router.push('/cart')
  }, 2000)
}

// Mua ngay
const buyNow = () => {
  // Kiểm tra đăng nhập
  const token = localStorage.getItem('token')
  if (!token) {
    showToast('error', 'Yêu cầu đăng nhập', 'Vui lòng đăng nhập mới có thể thanh toán')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    return
  } 
  
  if (!selectedSize.value || !selectedColor.value) {
    showToast('error', 'Lỗi', 'Vui lòng chọn phiên bản và màu sắc')
    return
  }

  showToast('success', 'Thành công', 'Chuyển tới trang thanh toán')
  setTimeout(() => {
    router.push('/checkout')
  }, 2000)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

onMounted(fetchProduct)
</script>
