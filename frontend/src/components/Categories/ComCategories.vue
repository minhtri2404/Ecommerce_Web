<template>
  <section class="py-12 px-4">
    <h1 class="text-3xl font-semibold text-center mx-auto">Danh mục sản phẩm</h1>
    <p class="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
      Khám phá các danh mục nổi bật trong cửa hàng của chúng tôi.
    </p>

    <div class="flex flex-wrap items-center justify-center mt-12 gap-4 max-w-5xl mx-auto">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="relative group rounded-lg overflow-hidden"
      >
        <img
          :src="category.image"
          :alt="category.title"
          class="size-56 object-cover object-top"
        />
        <div
          class="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <h2 class="text-xl font-medium">{{ category.title }}</h2>
          <router-link
            :to="category.url"
            class="flex items-center gap-1 text-sm text-white/70"
          >
            Xem sản phẩm
            <svg
              width="16"
              height="16"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.125 1.625H11.375V4.875"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.41602 7.58333L11.3743 1.625"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const categories = [
  {
    title: 'Thời trang nữ',
    image:
      'https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&w=687&auto=format&fit=crop',
    url: '/categories/women',
  },
  {
    title: 'Thời trang nam',
    image:
      'https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&w=703&auto=format&fit=crop',
    url: '/categories/men',
  },
  {
    title: 'Phụ kiện',
    image:
      'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=687&auto=format&fit=crop',
    url: '/categories/accessories',
  },
  {
    title: 'Giày dép',
    image:
      'https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&w=798&auto=format&fit=crop',
    url: '/categories/shoes',
  },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>
