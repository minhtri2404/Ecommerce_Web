<template>
  <div>
    <!-- Hiển thị các phần khác -->
    <Categories />
    <PopularProducts />
    <LatestBlogPosts />
    <ComFooter />
  </div>
</template>

<script setup>
import Categories from '@/components/Categories/ComCategories.vue'
import PopularProducts from '@/components/PopularProducts/PopularProducts.vue';
import LatestBlogPosts from '@/components/LatestBlogPosts/LatestBlogPosts.vue';
import ComFooter from '@/components/Footer/ComFooter.vue'
</script>


