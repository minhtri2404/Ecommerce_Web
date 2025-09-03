<template>
  <section class="py-12 px-4">
    <h1 class="text-3xl font-semibold text-center mx-auto">Bài viết mới nhất</h1>
    <p class="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
      Tin tức, xu hướng thời trang và mẹo phối đồ mỗi tuần.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
      <div
        v-for="(post, index) in posts"
        :key="index"
        class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <img :src="post.image" :alt="post.title" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-1">{{ post.title }}</h2>
          <p class="text-sm text-gray-500 mb-2">{{ post.excerpt }}</p>
          <a
            :href="post.url"
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
const posts = [
  {
    title: 'Top 5 xu hướng thời trang hè 2025',
    excerpt: 'Khám phá những phong cách không thể bỏ qua mùa hè này...',
    image: new URL('@/assets/img/blog/blog-2.jpg', import.meta.url).href,
    url: '/blog/summer-trends-2025',
  },
  {
    title: 'Cách phối đồ basic mà vẫn thu hút',
    excerpt: 'Dành cho bạn muốn đơn giản mà không đơn điệu...',
    image: new URL('@/assets/img/blog/blog-8.jpg', import.meta.url).href,
    url: '/blog/basic-style-guide',
  },
  {
    title: '5 món đồ mọi cô gái nên có',
    excerpt: 'Một số item cơ bản giúp bạn dễ phối và ứng dụng hàng ngày.',
    image: new URL('@/assets/img/blog/blog-4.jpg', import.meta.url).href,
    url: '/blog/must-have-items',
  },

  {
    title: 'Cách phối đồ đường phố',
    excerpt: 'Một số item cơ bản giúp bạn dễ phối và ứng dụng hàng ngày.',
    image: new URL('@/assets/img/blog/blog-6.jpg', import.meta.url).href,
    url: '/blog/must-have-items',
  },
];
</script>
