<template>
  <section class="py-12 px-4">
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

    <div class="flex flex-wrap justify-center gap-6 mt-10">
      <div
        v-for="category in categories"
        :key="category._id"
        class="w-40 h-40 rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center bg-white hover:shadow-xl transition"
      >
        <img
          :src="category.image || 'https://via.placeholder.com/150'"
          alt="Ảnh danh mục"
          class="w-20 h-20 object-cover rounded-full mb-3"
        />
        <p class="text-center font-medium text-gray-700">{{ category.categoryName }}</p>
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
                image: category.image // ✅ THÊM DÒNG NÀY
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
