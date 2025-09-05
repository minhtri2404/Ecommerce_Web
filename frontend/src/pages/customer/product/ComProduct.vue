<template>
  <section class="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
     <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <!-- Sidebar -->
    <aside class="bg-white rounded-lg p-4 space-y-6">
      <!-- Search -->
      <div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="w-full border rounded px-3 py-2 text-sm"
          @input="fetchProducts"
        />
      </div>

      <!-- Categories -->
      <div>
        <h3 class="font-semibold mb-2 ">Danh mục</h3>
        <div
          v-for="cat in categories"
          :key="cat._id"
          class="flex justify-between items-center text-sm py-1"
        >
          <label class="cursor-pointer flex items-center">
            <input type="checkbox" :value="cat._id" v-model="selectedCategories" class="mr-2" @change="fetchProducts" />
            {{ cat.categoryName }}
          </label>
          
        </div>
      </div>

      <!-- Filter Price -->
      <div>
        <h3 class="font-semibold mb-2">Lọc theo giá tiền</h3>
        <div v-for="(range, i) in priceRanges" :key="i" class="flex items-center text-sm py-1">
          <input type="radio" name="price" :value="range" v-model="selectedPrice" class="mr-2" @change="fetchProducts" />
          <label>{{ range.label }}</label>
        </div>
      </div>

      <!-- Size -->
      <div>
        <h3 class="font-semibold mb-2">Kích thước</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="size in sizes"
            :key="size"
            @click="() => { toggleSize(size); fetchProducts(); }"
            :class="[
              'px-3 py-1 border rounded text-sm',
              selectedSizes.includes(size.toUpperCase()) ? 'bg-black text-white' : 'bg-white'
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Colors -->
      <div>
        <h3 class="font-semibold mb-2">Màu sắc</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in colors"
            :key="color"
            @click="() => { toggleColor(color); fetchProducts(); }"
            :class="[
              'px-3 py-1 border rounded text-sm',
              selectedColors.includes(color) ? 'bg-black text-white' : 'bg-white'
            ]"
          >
            {{ color }}
          </button>
        </div>
      </div>

      <button @click="resetFilters" class="text-sm text-red-500 mt-4 cursor-pointer underline">Xóa bộ lọc</button>
    </aside>

    <!-- Main Content -->
    <div>
      <div class="flex flex-wrap justify-between items-center mb-4">
        <h2 class="flex-1 text-2xl font-semibold text-center">Tất cả sản phẩm</h2>
        <select v-model="sortBy" @change="fetchProducts" class="border px-3 py-1 rounded text-sm">
          <option value="newest">Mới nhất</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in products" :key="product._id" class="bg-white rounded-lg shadow p-4">
          <img
            :src="`http://localhost:4000/uploads/product/${product.images[0]}`"
            class="h-48 w-full object-cover rounded"
            alt="Product image"
          />
          <h3 class="font-semibold mt-2">{{ product.name }}</h3>
          <p class="text-gray-500 text-sm">{{ product.description?.slice(0, 50) }}</p>
          <div class="mt-2">
            <span class="text-lg font-medium text-gray-800">{{ formatPrice(product.price) }}</span>
          </div>
          <button class="mt-3 w-full py-2 bg-emerald-600 text-white rounded text-sm">
            <router-link :to="`/product/${product._id}`"> Xem chi tiết sản phẩm</router-link>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue';

const route = useRoute()
const categoryId = ref(null)
const products = ref([])
const totalProducts = ref(0)
const categories = ref([])
const sortBy = ref('newest')

const searchQuery = ref('')
const selectedCategories = ref([])
const selectedPrice = ref(null)
const selectedSizes = ref([])
const selectedColors = ref([])

const sizes = ['S','M','L','XL']
const colors = ['Đen', 'Trắng', 'Đỏ', 'Vàng', 'Xanh', 'Hồng', 'Nâu', 'Tím']
const priceRanges = [
  { label: '0đ - 50.000đ', min: 0, max: 50000 },
  { label: '50.000đ - 100.000đ', min: 50000, max: 100000 },
  { label: '100.000đ - 200.000đ', min: 100000, max: 200000 },
  { label: '200.000đ - 400.000đ', min: 200000, max: 400000 },
  { label: '400.000đ - 600.000đ', min: 400000, max: 600000 },
  { label: '600.000đ+', min: 600000, max: Infinity }
]

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

// Chọn kích thước
const toggleSize = (size) => {
  const upperSize = size.toUpperCase()
  if (selectedSizes.value.includes(upperSize)) {
    selectedSizes.value = selectedSizes.value.filter(s => s !== upperSize)
  } else {
    selectedSizes.value.push(upperSize)
  }
}

//chọn màu sắc
const toggleColor = (color) => {
  if (selectedColors.value.includes(color)) {
    selectedColors.value = selectedColors.value.filter(c => c !== color)
  } else {
    selectedColors.value.push(color)
  }
}


// Gọi API để lấy danh sách sản phẩm
const fetchProducts = async () => {
  let query = []
  if (categoryId.value) query.push(`category=${categoryId.value}`)
  if (searchQuery.value) query.push(`search=${searchQuery.value}`)
  if (selectedCategories.value.length) query.push(`category=${selectedCategories.value.join(',')}`)
  if (selectedPrice.value) query.push(`minPrice=${selectedPrice.value.min}&maxPrice=${selectedPrice.value.max}`)
  if (selectedSizes.value.length) query.push(`sizes=${selectedSizes.value.join(',')}`)
  if (selectedColors.value.length) query.push(`colors=${selectedColors.value.join(',')}`)
  if (sortBy.value) query.push(`sort=${sortBy.value}`)

  const url = `http://localhost:4000/api/products?${query.join('&')}`

  try {
    const res = await axios.get(url)
    if (res.data.success) {
      products.value = res.data.products
      totalProducts.value = res.data.total
    } else {
      showToast('error', 'Lỗi', res.data.message || 'Không thể tải sản phẩm.')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.')
  }
}

// GỌI API để hiển thị toàn bộ danh mục
const fetchCategories = async () => {
  try {
    const res = await axios.get('http://localhost:4000/api/categories')
    if (res.data.success) {
      categories.value = res.data.categories
    } else{
      showToast('error', 'Lỗi', res.data.message || 'Không thể tải danh mục.')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.')
  }
}
// Reset bộ lọc
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  selectedPrice.value = null
  selectedSizes.value = []
  selectedColors.value = []
  fetchProducts()
}
// Định dạng giá tiền
const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

onMounted(() => {
  categoryId.value = route.query.category || null
  fetchCategories()
  fetchProducts()
})

// Nếu user ở lại /shop và query param category thay đổi, tự động fetch
watch(() => route.query.category, (newCategory) => {
  categoryId.value = newCategory || null
  fetchProducts()
})
</script>
