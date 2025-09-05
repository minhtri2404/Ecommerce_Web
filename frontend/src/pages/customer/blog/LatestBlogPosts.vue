<template>
  <section class="py-12 px-4 relative">
    <h1 class="text-3xl font-semibold text-center mx-auto">Bài viết mới nhất</h1>
    <p class="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
      Tin tức, xu hướng thời trang và mẹo phối đồ mỗi tuần.
    </p>

    <!-- Container -->
    <div class="relative max-w-6xl mx-auto mt-12">
      <!-- Slider -->
      <div
        ref="slider"
        class="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
      >
        <div
          v-for="blog in blogs"
          :key="blog._id"
          class="w-72 flex-shrink-0 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <img
            :src="`http://localhost:4000/uploads/blog/${blog.image}`"
            alt="Hình ảnh blog"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="text-lg font-semibold mb-1">{{ blog.title }}</h2>
            <p class="text-sm text-gray-500 mb-2">{{ blog.slug }}</p>
            <a
              :href="`/blog/${blog._id}`"
              class="inline-block mt-3 text-sm text-indigo-500 hover:underline"
            >
              Đọc thêm →
            </a>
          </div>
        </div>
      </div>

      <!-- Arrows -->
      <button
        @click="prevSlide"
        class="absolute top-1/2 -left-6 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-3 rounded-full text-white z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        @click="nextSlide"
        class="absolute top-1/2 -right-6 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-3 rounded-full text-white z-10"
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

const blogs = ref([])
const slider = ref(null)

// Gọi API để hiển thị tất cả bài viết
const fetchNewBlog = async() => {
  try {
    const res = await axios.get('http://localhost:4000/api/blog')
    if (res.data.success) {
      blogs.value = res.data.blog
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      console.log('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
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

onMounted(fetchNewBlog)
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
