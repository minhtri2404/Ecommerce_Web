<template>
  <div>
    <!-- Hiển thị các phần khác -->
    <Categories />
    <PopularProducts />
    <LatestBlogPosts />
  </div>
</template>

<script setup>
import Categories from '@/components/Categories/ComCategories.vue'
import PopularProducts from '@/components/PopularProducts/PopularProducts.vue';
import LatestBlogPosts from '../blog/LatestBlogPosts.vue';
</script>


