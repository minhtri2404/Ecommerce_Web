<template>
  <div class="py-10 bg-white">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <h2 class="text-2xl font-semibold text-center mb-6">Thêm Sản Phẩm Mới</h2>
    <form @submit.prevent="handleSubmit" class="md:p-10 p-4 space-y-8 max-w-5xl mx-auto">
      
      <!-- Upload Images -->
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <label
            v-for="index in 4"
            :key="index"
            :for="`image${index}`"
            class="cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              :id="`image${index}`"
              hidden
              @change="handleFileUpload($event, index - 1)"
            />
            <div
              class="w-24 h-24 border rounded flex items-center justify-center bg-gray-50 text-sm text-gray-500 overflow-hidden"
            >
              <template v-if="imagePreviews[index - 1]">
                <img
                  :src="imagePreviews[index - 1]"
                  class="w-full h-full object-cover rounded"
                  alt="preview"
                />
              </template>
              <template v-else>
                Upload
              </template>
            </div>
          </label>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Left column -->
        <div class="space-y-5">
          <!-- Product Name -->
          <div class="flex flex-col gap-1">
            <label class="text-base font-medium" for="name">Tên sản phẩm</label>
            <input
              id="name"
              v-model="product.name"
              type="text"
              class="outline-none py-2 px-3 rounded border border-gray-400"
            />
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-1">
            <label class="text-base font-medium" for="description">Mô tả</label>
            <textarea
              id="description"
              v-model="product.description"
              rows="4"
              class="outline-none py-2 px-3 rounded border border-gray-400 resize-none"
            ></textarea>
          </div>

          <!-- Category -->
          <div class="flex flex-col gap-1">
            <label class="text-base font-medium" for="category">Danh mục</label>
            <select
              id="category"
              v-model="product.category"
              class="outline-none py-2 px-3 rounded border border-gray-400"
            >
              <option value="">Chọn danh mục</option>
              <option
                v-for="item in categories"
                :key="item._id"
                :value="item._id"
              >
                {{ item.categoryName }}
              </option>
            </select>
          </div>

          <!-- Is Featured -->
          <div class="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isFeatured"
              v-model="product.isFeatured"
              class="accent-indigo-500"
            />
            <label for="isFeatured" class="text-base font-medium">Nổi bật</label>
          </div>
        </div>

        <!-- Right column -->
        <div class="space-y-5">
          <!-- Sizes -->
          <div class="flex flex-col gap-1">
            <label class="text-base font-medium">Kích cỡ</label>
            <div class="flex flex-wrap gap-3">
              <label
                v-for="size in sizeOptions"
                :key="size"
                class="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :value="size"
                  v-model="product.sizes"
                  class="accent-indigo-500"
                />
                {{ size }}
              </label>
            </div>
          </div>

          <!-- Colors -->
          <div class="flex flex-col gap-1">
            <label class="text-base font-medium">Màu sắc</label>
            <input
              v-model="colorInput"
              @keydown.enter.prevent="addColor"
              placeholder="Nhập màu và nhấn Enter"
              class="outline-none py-2 px-3 rounded border border-gray-400"
            />
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(color, index) in product.colors"
                :key="index"
                class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {{ color }}
                <button type="button" @click="removeColor(index)">×</button>
              </span>
            </div>
          </div>

          <!-- Price -->
          <div class="flex flex-col gap-1">
            <label class="text-base font-medium" for="price">Giá</label>
            <input
              id="price"
              type="number"
              v-model.number="product.price"
              placeholder="0"
              class="outline-none py-2 px-3 rounded border border-gray-400"
            />
          </div>

          <!-- Quantity -->
          <div class="flex flex-col gap-1">
            <label class="text-base font-medium" for="quantity">Số lượng</label>
            <input
              id="quantity"
              type="number"
              v-model.number="product.quantity"
              placeholder="0"
              class="outline-none py-2 px-3 rounded border border-gray-400"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <button type="submit" class="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">
          Thêm sản phẩm
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';
import Alert from '@/components/Alert/ComAlert.vue';

const router = useRouter();
const categories = ref([])
const sizeOptions = ['S', 'M', 'L', 'XL']
const colorInput = ref('')
const product = ref({
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  category: '',
  sizes: [],
  colors: [],
  isFeatured: false,
})

const imageFiles = ref([null, null, null, null])   // ✅ ảnh thật để gửi FormData
const imagePreviews = ref([null, null, null, null]) // ✅ URL để hiển thị ảnh
const handleFileUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    imageFiles.value[index] = file
    imagePreviews.value[index] = URL.createObjectURL(file)
  }
}

// Nhập màu sắc và nhấn Enter để thêm màu
const addColor = () => {
    const val = colorInput.value.trim()
    if (val && !product.value.colors.includes(val)) {
        product.value.colors.push(val)
    }
    colorInput.value = ''
}

// Xóa màu sắc khi nhấn nút X
const removeColor = (index) => {
    product.value.colors.splice(index, 1)
}

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

// Gọi API để hiển thị tất cả danh mục 
const fetchCategories = async() => {
    try {
    const res = await axios.get('http://localhost:4000/api/categories/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (res.data.success) {
      categories.value = res.data.categories
    } else {
      showToast('error', 'Lỗi', res.data.error || 'Không thể tải dữ liệu.')
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.')
  }
}

// Nhấn nút Submit để thêm sản phẩm
const handleSubmit = async() => {
    const formData = new FormData()
    formData.append('name', product.value.name)
    formData.append('description', product.value.description)
    formData.append('price', product.value.price)
    formData.append('quantity', product.value.quantity)
    formData.append('category', product.value.category)
    formData.append('sizes', product.value.sizes);
    formData.append('colors', product.value.colors)
    formData.append('isFeatured', product.value.isFeatured)
     // ✅ Thêm tất cả ảnh vào formData
    imageFiles.value.forEach((file) => {
        if (file) formData.append('images', file)
    })
    try {
        const res = await axios.post('http://localhost:4000/api/products/add', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (res.data.success) {
            showToast('success','Thành công', 'Thêm sản phẩm thành công!');
            setTimeout(() => {
                router.push('/admin-dashboard/product');
            }, 2000); // đợi alert hiển thị một chút
        } else {
            showToast('error', 'Thất bại', res.data.error || 'Thêm sản phẩm thất bại.')
        }
    } catch (error) {
        showToast('error', 'Thất bại', error.response?.data?.error || 'Lỗi máy chủ.')
    }
}

onMounted(fetchCategories)
</script>