<template>
  <section class="bg-[#f9f8f4] overflow-hidden relative">
    <div class="container mx-auto px-8 py-24 flex flex-col md:flex-row items-center justify-between">
      <!-- Left: Text content -->
      <div class="md:w-1/2 space-y-6 text-center md:text-left">
        <p class="uppercase text-sm tracking-widest text-red-500">Summer Collection</p>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          {{ currentSlide.title }}
        </h1>
        <p class="text-gray-600">
          {{ currentSlide.description }}
        </p>
        <button class="bg-black text-white px-6 py-3 uppercase tracking-wide font-medium hover:bg-gray-800 transition">
          <router-link to="/shop"> Shop Now →</router-link>
        </button>

        <!-- Socials -->
        <div class="flex justify-center md:justify-start space-x-4 pt-4 text-gray-600 text-xl">
          <i class="fab fa-facebook-f"></i>
          <i class="fab fa-github"></i>
          <i class="fab fa-instagram"></i>
          <i class="fab fa-youtube"></i>
        </div>
      </div>

      <!-- Right: Image -->
      <div class="md:w-1/2 relative mt-12 md:mt-0">
        <div class="absolute bg-pink-100 rounded-full w-[380px] h-[380px] top-0 right-0 -z-10 translate-x-1/4 -translate-y-1/4"></div>
        <img :src="currentSlide.image" :alt="currentSlide.title" class="w-full max-w-lg mx-auto" />
      </div>
    </div>

    <!-- Arrows -->
    <button @click="prevSlide" class="absolute top-1/2 left-6 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-3 rounded-full text-white z-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button @click="nextSlide" class="absolute top-1/2 right-6 -translate-y-1/2 bg-black/20 hover:bg-black/40 p-3 rounded-full text-white z-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const slides = [
  {
    title: 'Bộ Sưu Tập Thu – Đông 2030',
    description:
      'Bộ sưu tập Thu – Đông 2030 là sự kết hợp tinh tế giữa nghệ thuật thủ công truyền thống và hơi thở hiện đại. Với những gam màu trung tính chủ đạo, chất liệu cao cấp như len cashmere, lụa tơ tằm và cotton hữu cơ, mỗi sản phẩm không chỉ là một thiết kế thời trang mà còn là một tác phẩm nghệ thuật phản ánh gu thẩm mỹ và đẳng cấp sống của bạn. Chúng tôi tin rằng thời trang không chỉ để mặc, mà còn là cách bạn thể hiện chính mình – tinh tế, mạnh mẽ và đầy nội lực.',
    image: new URL('@/assets/img/hero-1.jpg', import.meta.url).href,
  },

  {
    title: 'Bộ Sưu Tập Mới Đã Có Mặt',
    description:
      'Trong một thế giới đầy biến động và xô bồ, chúng tôi chọn cách quay về với những giá trị bền vững, đơn giản và vững chắc. Bộ sưu tập này mang đến những thiết kế vượt thời gian, nơi sự giản dị trở thành ngôn ngữ của sự sang trọng. Không cần màu mè, không chạy theo xu hướng, chỉ cần bạn là chính mình – tự tin, thanh lịch và tràn đầy khí chất. Đây là thời trang dành cho những người hiểu rõ bản thân và lựa chọn sự khác biệt một cách tinh tế.',
    image: new URL('@/assets/img/hero-2.jpg', import.meta.url).href,
  },
]

const current = ref(0)

const currentSlide = computed(() => slides[current.value])

const nextSlide = () => {
  current.value = (current.value + 1) % slides.length
}

const prevSlide = () => {
  current.value = (current.value - 1 + slides.length) % slides.length
}

// Auto slide every 5s
let timer = null
onMounted(() => {
  timer = setInterval(nextSlide, 5000)
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>


