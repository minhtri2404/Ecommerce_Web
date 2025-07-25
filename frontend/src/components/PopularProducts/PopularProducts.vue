<template>
  <section class="py-12 px-4">
    <h1 class="text-3xl font-semibold text-center mx-auto">Sản phẩm phổ biến</h1>
    <p class="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
      Những sản phẩm được yêu thích và bán chạy nhất trong cửa hàng.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <img :src="product.image" :alt="product.title" class="w-full h-56 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-medium mb-1">{{ product.title }}</h2>
          <p class="text-sm text-gray-500 mb-2">{{ product.description }}</p>
          <p class="text-base font-semibold text-indigo-600">{{ product.price }}</p>
          <a
            :href="product.url"
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
const products = [
  {
    title: 'Áo thun oversize',
    description: 'Chất liệu cotton 100%, mềm mịn thoáng mát.',
    price: '250.000₫',
    image: new URL('@/assets/img/product/product-9.jpg', import.meta.url).href,
    url: '/product/1',
  },
  {
    title: 'Áo khoác nam',
    description: 'Thiết kế đơn giản, form slim-fit.',
    price: '450.000₫',
    image: new URL('@/assets/img/product/product-2.jpg', import.meta.url).href,
    url: '/product/2',
  },
  {
    title: 'Túi xách vintage',
    description: 'Phù hợp đi chơi, đi biển, dạo phố.',
    price: '320.000₫',
    image: new URL('@/assets/img/product/product-13.jpg', import.meta.url).href,
    url: '/product/3',
  },
  {
    title: 'Kính mắt hàng hiệu',
    description: 'Chống nắng, phù hợp thời tiết thu đông.',
    price: '520.000₫',
    image: new URL('@/assets/img/product/product-14.jpg', import.meta.url).href,
    url: '/product/4',
  },
];
</script>
