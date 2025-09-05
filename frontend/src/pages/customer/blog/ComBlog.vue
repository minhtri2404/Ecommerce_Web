<template>
    <section class="max-w-5xl mx-auto px-4 py-10">
        <!-- Tiêu đề -->
        <h2 class="text-xl font-bold border-l-4 border-red-500 pl-2 mb-6 uppercase">Tin tức mới nhất</h2>

        <!-- Danh sách tin tức -->
        <div class="space-y-6">
            <div
                v-for="blog in paginatedBlogs"
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

        <!-- Pagination -->
        <div class="mt-6 flex justify-center">
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
                >{{ page }}
              </button>
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
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const blogs = ref([])
const currentPage = ref(1)
const itemsPerPage = 4

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

// Tổng số trang
const totalPages = computed(() =>
  Math.ceil(blogs.value.length / itemsPerPage)
)

// Blog theo từng trang
const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return blogs.value.slice(start, end)
})

// Chuyển trang
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
const prevPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)


onMounted(fetchNewBlog)

</script>