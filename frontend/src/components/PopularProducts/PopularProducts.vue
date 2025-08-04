<template>
  <section class="py-12 px-4">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <h1 class="text-3xl font-semibold text-center mx-auto">Sản phẩm nổi bật</h1>
    <p class="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
      Những sản phẩm được yêu thích và bán chạy nhất trong cửa hàng.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
      <div
        v-for="product in products"
        :key="product._id"
        class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <img
          :src="`http://localhost:4000/uploads/product/${product.images[0]}`"
          :alt="product.name"
          class="w-full h-56 object-cover"
        />
        <div class="p-4">
          <h2 class="text-lg font-medium mb-1">{{ product.name }}</h2>
          <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ product.description }}</p>
          <p class="text-base font-semibold text-indigo-600">
            {{ product.price.toLocaleString() }}₫
          </p>
          <a
            :href="`/product/${product._id}`"
            class="inline-block mt-3 text-sm text-indigo-500 hover:underline"
          >
            Xem chi tiết
          </a>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';

const products = ref([])

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

// Gọi API để hiển thị sản phẩm nổi bật
const fetchFeaturedProducts = async() => {
  try {
    const res = await axios.get('http://localhost:4000/api/products/featured')
    if (res.data.success) {
      products.value = res.data.products
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
    }
  }
}

onMounted(fetchFeaturedProducts)
</script>

