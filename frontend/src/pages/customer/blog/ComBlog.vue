<template>
    <section class="max-w-5xl mx-auto px-4 py-10">
        <!-- Tiêu đề -->
        <h2 class="text-xl font-bold border-l-4 border-red-500 pl-2 mb-6 uppercase">Tin tức mới nhất</h2>

        <!-- Danh sách tin tức -->
        <div class="space-y-6">
            <div
                v-for="blog in blogs"
                :key="blog._id"
                class="flex gap-4 border-b pb-6"
            >
                <!-- Ảnh -->
                <img
                    :src="`http://localhost:4000/uploads/blog/${blog.image}`"
                    alt="blog image"
                    class="w-40 h-28 object-cover rounded-md flex-shrink-0"
                />

                <!-- Nội dung -->
                <div class="flex-1">
                    <!-- Tiêu đề -->
                    <RouterLink
                        :to="`/blog/${blog._id}`"
                        class="text-lg font-semibold text-red-600 hover:underline cursor-pointer"
                        >
                        {{ blog.title }}
                    </RouterLink>

                    <!-- Nội dung rút gọn -->
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2" >
                        {{ blog.content.replace(/<[^>]+>/g, '') }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const blogs = ref([])

// Gọi APi để hiển thị tất cả bài viết
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