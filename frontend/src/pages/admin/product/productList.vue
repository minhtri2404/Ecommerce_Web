<template>
  <div class="flex-1 py-10 flex flex-col justify-between">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />

    <h2 class="text-2xl font-semibold text-center mb-6">Quản Lý Sản Phẩm</h2>

    <!-- Search & Button -->
    <div class="flex justify-between items-center px-4 mb-8">
      <div class="w-full max-w-xs">
        <input
          v-model="search"
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm"
          class="w-full px-4 py-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:border-indigo-400 shadow-sm"
        />
      </div>
      <router-link to="/admin-dashboard/add-product">
        <button class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded shadow">
          Thêm sản phẩm mới
        </button>
      </router-link>
    </div>

    <!-- Product Table -->
    <div class="w-full md:p-10 p-4">
      <div class="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table class="md:table-auto table-fixed w-full overflow-hidden">
          <thead class="text-gray-900 text-sm text-left">
            <tr>
              <th class="px-4 py-3 font-semibold truncate">STT</th>
              <th class="px-4 py-3 font-semibold truncate">Ảnh</th>
              <th class="px-4 py-3 font-semibold truncate">Tên sản phẩm</th>
              <th class="px-4 py-3 font-semibold truncate">Danh mục</th>
              <th class="px-4 py-3 font-semibold truncate">Giá</th>
              <th class="px-4 py-3 font-semibold truncate">Tồn kho</th>
              <th class="px-4 py-3 font-semibold truncate">Nổi bật</th>
              <th class="px-4 py-3 font-semibold truncate text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="text-sm text-gray-500">
            <tr
              v-for="item in paginatedProducts"
              :key="item.id"
              class="border-t border-gray-500/20"
            >
              <td class="px-4 py-3">{{ item.sno }}</td>
              <td class="px-4 py-3">
                <img
                    v-if="item.images"
                  :src="`http://localhost:4000/uploads/product/${item.images[0]}`"
                  alt="Hình ảnh sản phẩm"
                  class="w-16 h-16 object-cover rounded"
                />
              </td>
              <td class="px-4 py-3">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.category|| 'N/A' }}</td>
              <td class="px-4 py-3">{{ formatPrice(item.price) }}</td>
              <td class="px-4 py-3">{{ item.quantity }}</td>
              <td class="px-4 py-3">
                <label class="relative inline-flex items-center cursor-pointer w-11 h-6">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    v-model="item.isFeatured"
                  />
                  
                  <!-- Khung toggle -->
                  <div class="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
                  
                  <!-- Dot toggle -->
                  <div
                    class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300
                          translate-x-5 peer-checked:translate-x-0"
                  ></div>
                </label>
              </td>
              <td class="px-4 py-3 text-center space-x-2">
                <button
                  @click="editProduct(item.id)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >Sửa</button>
                <button
                  @click="deleteProduct(item.id)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >Xoá</button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
      <div class="mt-6 flex justify-end">
        <div class="flex items-center gap-4 text-gray-500 font-medium">
          <!-- Previous -->
          <button @click="prevPage" :disabled="currentPage === 1" aria-label="prev"
            class="rounded-full bg-slate-200/50 disabled:opacity-50">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z"
                fill="#475569" stroke="#475569" stroke-width=".078" />
            </svg>
          </button>

          <!-- Page Numbers -->
          <div class="flex items-center gap-2 text-sm font-medium">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[ 'h-10 w-10 flex items-center justify-center aspect-square',
                currentPage === page
                  ? 'text-indigo-500 border border-indigo-200 rounded-full'
                  : ''
              ]"
            >{{ page }}</button>
          </div>

            <!-- Next -->
          <button @click="nextPage" :disabled="currentPage === totalPages" aria-label="next"
            class="rounded-full bg-slate-200/50 disabled:opacity-50">
              <svg class="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z"
                  fill="#475569" stroke="#475569" stroke-width=".078" />
              </svg>
            </button>
          </div>
        </div>

      <!-- Loading -->
      <div v-if="loading" class="p-4 text-center text-gray-500">Loading...</div>
      <div v-if="!loading && filteredProducts.length === 0" class="p-4 text-center text-gray-500">
        Không tìm thấy sản phẩm nào.
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue';

const router = useRouter()
const products = ref([])
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

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
};

// Gọi API để hiển thị tất cả sản phẩm
const fetchProducts = async() => {
    loading.value = true;
    try {
        const res = await axios.get('http://localhost:4000/api/products', {
             headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (res && res.data && Array.isArray(res.data.products)) {
            products.value = res.data.products.map((product, index) => ({
                id: product._id,
                sno: index + 1,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                images: product.images,
                category: product.category?.categoryName || 'N/A',
                sizes: product.sizes,
                colors: product.colors,
                isFeatured: product.isFeatured
            }))
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
        }
    } finally{
        loading.value = false
    }
}

// Di chuyển đến trang edit product
const editProduct = (id) => {
  router.push(`/admin-dashboard/product/${id}`)
}


// Tìm kiếm danh mục theo tên
const filteredProducts = computed(() =>
  products.value.filter(product =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

//Phân trang
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)

// Định dạng giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

onMounted(fetchProducts)
</script>