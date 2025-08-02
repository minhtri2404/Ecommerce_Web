<template>
  <div class="max-w-4xl mx-auto mt-10 px-6">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />

    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center mb-6">Chỉnh sửa sản phẩm</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <!-- Name -->
          <label class="block font-medium mb-1">Tên sản phẩm</label>
          <input v-model="product.name" type="text" class="w-full border rounded px-3 py-2" />
        </div>
        <!-- Description -->
        <div>
          <label class="block font-medium mb-1">Mô tả</label>
          <textarea v-model="product.description" rows="4" class="w-full border rounded px-3 py-2" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Price -->
          <div>
            <label class="block font-medium mb-1">Giá</label>
            <input v-model="product.price" type="number" step="0.01" min="0" class="w-full border rounded px-3 py-2" />
          </div>
          <!-- Quantity -->
          <div>
            <label class="block font-medium mb-1">Số lượng</label>
            <input v-model="product.quantity" type="number" class="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <!-- Category -->
        <div>
          <label class="block font-medium mb-1">Danh mục</label>
          <select v-model="product.category" class="w-full border rounded px-3 py-2">
            <option disabled value="">Chọn danh mục</option>
            <option v-for="item in categories" :key="item._id" :value="item._id">
              {{ item.categoryName }}
            </option>
          </select>
        </div>

        <!-- Sizes -->
        <div>
          <label class="block font-medium mb-1">Kích cỡ</label>
          <div class="flex gap-2 flex-wrap">
            <label v-for="size in sizeOptions" :key="size" class="flex items-center space-x-1">
              <input
                type="checkbox"
                :value="size"
                v-model="product.sizes"
                class="rounded"
              />
              <span>{{ size }}</span>
            </label>
          </div>
        </div>

        <!-- Colors -->
        <div>
          <label class="block font-medium mb-1">Màu sắc</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(color, index) in product.colors"
              :key="index"
              class="bg-gray-200 px-2 py-1 rounded flex items-center"
            >
              {{ color }}
              <button @click.prevent="removeColor(index)" class="ml-1 text-red-500">×</button>
            </span>
          </div>
          <div class="flex mt-2 gap-2">
            <input 
            v-model="colorInput"
            @keydown.enter.prevent="addColor"
            placeholder="Nhập màu và nhấn Enter" 
            class="border rounded px-2 py-1" />
          </div>
        </div>

      <!-- Upload Images -->
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <label
            v-for="index in 4"
            :key="index"
            class="relative w-24 h-24 border rounded overflow-hidden cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              class="absolute inset-0 opacity-0 cursor-pointer"
              @change="handleFileUpload($event, index - 1)"
            />
            <div
              class="w-full h-full flex items-center justify-center bg-gray-50 text-sm text-gray-500"
            >
              <img
                v-if="imagePreviews[index - 1]"
                :src="imagePreviews[index - 1]"
                class="w-full h-full object-cover"
                alt="preview"
              />
              <span v-else>Upload</span>
            </div>
            <button
              type="button"
              v-if="imagePreviews[index - 1]"
              class="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl px-1"
              @click.stop.prevent="removeImage(index - 1)"
            >
              &times;
            </button>
          </label>
        </div>
      </div>

        <!-- Checkbox nổi bật -->
        <div class="flex items-center">
          <input
            type="checkbox"
            v-model="product.isFeatured"
            class="rounded border-gray-300 mr-2"
          />
          <label class="font-medium">Sản phẩm nổi bật</label>
        </div>

        <!-- Submit -->
        <div class="text-center">
          <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded">
            Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Alert from '@/components/Alert/ComAlert.vue';

const route = useRoute()
const router = useRouter()
const id = route.params.id

const categories = ref([]);
const sizeOptions = ['S', 'M', 'L', 'XL'];
const colorInput = ref('');
const imageFiles = ref([null, null, null, null]);
const imagePreviews = ref([null, null, null, null]);
const product = ref({
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  category: '',
  sizes: [],
  colors: [],
  isFeatured: false,
  images: []
})

const handleFileUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    imageFiles.value[index] = file
    imagePreviews.value[index] = URL.createObjectURL(file)
  }
}
// Nhấn nút X để xóa ảnh
const removeImage = (index) => {
  imageFiles.value[index] = null;
  imagePreviews.value[index] = null;
};

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
const showAlert = ref(false);
const alertType = ref('success');
const alertTitle = ref('');
const alertMessage = ref('');

const showToast = (type, title, message) => {
  alertType.value = type;
  alertTitle.value = title;
  alertMessage.value = message;
  showAlert.value = true;
};

// Gọi API để lấy danh mục của sản phẩm
const fetchCategories = async () => {
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

// Gọi API để lấy thông tin sản phẩm trước khi cập nhật
const fetchProducts = async() =>{
    try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (res.data.success) {
            const productData = res.data.product;
            product.value = {
                id: productData._id,
                name: productData.name,
                description: productData.description,
                price: productData.price,
                quantity: productData.quantity,
                category: productData.category,
                sizes: productData.sizes,
                colors: productData.colors,
                isFeatured: productData.isFeatured,
                images: productData.images || []
            };
            imageFiles.value = Array(4).fill(null);
            imagePreviews.value = Array(4).fill(null);
            productData.images.forEach((img, idx) => {
              if (idx < 4) {
                imageFiles.value[idx] = img;
                imagePreviews.value[idx] = `http://localhost:4000/uploads/product/${img}`;
              }
            });
          } else {
            showToast('error', 'Lỗi', res.data.error || 'Không thể tải dữ liệu.');
        }
    } catch (error) {
        showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.');
    }
}

// Nhấn nút Submit để cập nhật sản phẩm
const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('name', product.value.name);
  formData.append('description', product.value.description);
  formData.append('price', product.value.price);
  formData.append('quantity', product.value.quantity);
  formData.append('category', product.value.category);
  formData.append('isFeatured', product.value.isFeatured);
  formData.append('sizes', product.value.sizes);
  formData.append('colors', product.value.colors)
  const oldImages = imageFiles.value.map(file => typeof file === 'string' ? file : null).filter(Boolean);
  formData.append('oldImages', JSON.stringify(oldImages));

  imageFiles.value.forEach(file => {
    if (file && typeof file !== 'string') {
      formData.append('images', file);
    }
  });
    try {
        const res = await axios.put(`http://localhost:4000/api/products/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });

        if (res.data.success) {
            showToast('success', 'Thành công', 'Cập nhật sản phẩm thành công.');
            setTimeout(() => {
                router.push('/admin-dashboard/product');
            }, 2000); // đợi alert hiển thị một chút
        } else {
            showToast('error', 'Thất bại', res.data.error || 'Không thể cập nhật sản phẩm.');
        }
    } catch (error) {
        showToast('error', 'Thất bại', error.response?.data?.error || 'Không thể cập nhật sản phẩm.');
    }
}
onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>