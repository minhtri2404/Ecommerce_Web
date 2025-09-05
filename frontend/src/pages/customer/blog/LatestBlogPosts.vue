<template>
  <section class="py-12 px-4">
    <h1 class="text-3xl font-semibold text-center mx-auto">Bài viết mới nhất</h1>
    <p class="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
      Tin tức, xu hướng thời trang và mẹo phối đồ mỗi tuần.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
      <div
        v-for="blog in blogs"
        :key="blog._id"
        class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <img 
          :src="`http://localhost:4000/uploads/blog/${blog.image}`"
          alt="Hình ảnh danh mục" 
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
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';

const blogs = ref([])

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


onMounted(fetchNewBlog)
</script>
