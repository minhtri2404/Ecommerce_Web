<template>
  <section class="py-12 px-4 relative">
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

    <!-- Carousel wrapper -->
    <div class="relative max-w-6xl mx-auto mt-12">
      <!-- List -->
      <div
        ref="slider"
        class="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar justify-center"
      >
        <div
          v-for="product in products"
          :key="product._id"
          class="min-w-[250px] max-w-[250px] flex-shrink-0 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <img
            :src="`http://localhost:4000/uploads/product/${product.images[0]}`"
            :alt="product.name"
            class="w-full h-56 object-cover"
          />
          <div class="p-4">
            <h2 class="text-lg font-medium mb-1">{{ product.name }}</h2>
            <p class="text-sm text-gray-500 mb-2 line-clamp-2">
              {{ product.description }}
            </p>
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

      <!-- Arrows -->
      <button
        @click="prevSlide"
        class="absolute top-1/2 -left-6 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-3 rounded-full text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        @click="nextSlide"
        class="absolute top-1/2 -right-6 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-3 rounded-full text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';

const products = ref([])
const slider = ref(null)

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

// Hàm scroll
const nextSlide = () => {
  if (slider.value) {
    slider.value.scrollBy({ left: 300, behavior: 'smooth' }) // scroll 1 card
  }
}
const prevSlide = () => {
  if (slider.value) {
    slider.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}


onMounted(fetchFeaturedProducts)
</script>

<style>
/* Ẩn scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

