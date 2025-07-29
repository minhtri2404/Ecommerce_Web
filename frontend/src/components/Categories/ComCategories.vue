<template>
  <section class="py-10 px-4">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />

    <h1 class="text-3xl font-semibold text-center mx-auto">Danh mục sản phẩm</h1>
    <p class="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
      Khám phá các danh mục nổi bật trong cửa hàng của chúng tôi.
    </p>

    <div class="flex flex-wrap items-center justify-center mt-12 gap-4 max-w-5xl mx-auto">
      <div
        v-for="category in categories"
        :key="category._id"
        class="relative group rounded-lg overflow-hidden cursor-pointer"
      >
        <img
          :src="getCategoryImageUrl(category.categoryImage)"
          :alt="category.categoryName"
          class="size-56 object-cover object-top"
        />
        <div
          class="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <h2 class="text-xl font-medium">{{ category.categoryName }}</h2>
          <!-- Chưa xử lý router link này -->
          <router-link
            :to="`/products/category/${category._id}`"
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue';

const categories = ref([])
const loading = ref(false)

// ALERT state
const showAlert = ref(false);
const alertType = ref('success'); // success | error
const alertTitle = ref('');
const alertMessage = ref('');

const showToast = (type, title, message) => {
  alertType.value = type;
  alertTitle.value = title;
  alertMessage.value = message;
  showAlert.value = true;
};

// ✅ Hàm xử lý ảnh
const getCategoryImageUrl = (filename) => {
  if (!filename);
  return `http://localhost:4000/uploads/${filename}`;
}

//Gọi API để lấy tất cả danh mục
const fetchCategories = async() =>{
    loading.value = true
    try {
        const res = await axios.get('http://localhost:4000/api/categories', {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (res && res.data && Array.isArray(res.data.categories)) {
            categories.value = res.data.categories.map((category, index) => ({
                id: category._id,
                sno: index + 1,
                categoryName: category.categoryName,
                categoryDescription: category.categoryDescription,
                categoryImage: category.categoryImage
            }))
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
        }
    } finally{
        loading.value = false
    }
}
onMounted(fetchCategories)
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>