<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
    <h2 class="text-2xl font-semibold text-center mb-6">Quản lý danh mục</h2>

    <!-- Search & Button -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search by Name"
        class="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
      />
      <router-link to="/admin-dashboard/add-category">
        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto">
          Thêm danh mục mới
        </button>
      </router-link>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-sm font-medium text-gray-600">STT</th>
            <th class="px-6 py-3 text-sm font-medium text-gray-600">Hình ảnh</th>
            <th class="px-6 py-3 text-sm font-medium text-gray-600">Tên danh mục</th>
            <th class="px-6 py-3 text-sm font-medium text-gray-600">Mô tả</th>
            <th class="px-6 py-3 text-sm font-medium text-gray-600 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in paginatedCategories"
            :key="item.id"
            class="border-b last:border-b-0 hover:bg-gray-50"
          >
            <td class="px-6 py-4">{{ item.sno }}</td>
            <td class="px-6 py-4">
              <img
                v-if="item.categoryImage"
                :src="`http://localhost:4000/uploads/${item.categoryImage}`"
                alt="Hình ảnh danh mục"
                class="w-16 h-16 object-cover rounded"
              />
            </td>
            <td class="px-6 py-4">{{ item.categoryName }}</td>
            <td class="px-6 py-4">{{ item.categoryDescription }}</td>
            <td class="px-6 py-4 text-center">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                @click="editCategory(item.id)"
              >
                Edit
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                @click="deleteCategory(item.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

       <!-- Pagination -->
    <div class="mt-6 flex justify-end">
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
          >{{ page }}</button>
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

      <!-- Loading -->
      <div v-if="loading" class="p-4 text-center text-gray-500">Loading...</div>
      <div v-if="!loading && filteredCategories.length === 0" class="p-4 text-center text-gray-500">
        Không tìm thấy danh mục nào.
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue';

const router = useRouter()
const categories = ref([])
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

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
        const res = await axios.get('http://localhost:4000/api/categories')
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
// Di chuyển đến trang edit category
const editCategory = (id) => {
  router.push(`/admin-dashboard/category/${id}`)
}

// Gọi API để xóa danh mục
const deleteCategory = async(id) => {
  const confirmDelete = confirm('Bạn có muốn xóa danh mục này không')
    if(confirmDelete){
      try {
        const res = await axios.delete(`http://localhost:4000/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (res.data.success) {
          showToast('success','Thành công', 'Xóa danh mục thành công!', '');
          await fetchCategories(); // Cập nhật lại danh sách sau khi xóa
        } else {
          showToast('error', 'Thất bại', res.data.error || 'Xóa thất bại.')
        }
    } catch (error) {
        showToast('error','Thất bại', 'Đã xảy ra lỗi khi xóa danh mục.', error.response ? error.response.data.error : error.message);
    }
  }
}


// Tìm kiếm danh mục theo tên
const filteredCategories = computed(() =>
  categories.value.filter(category =>
    category.categoryName.toLowerCase().includes(search.value.toLowerCase())
  )
)

//Phân trang
const totalPages = computed(() =>
  Math.ceil(filteredCategories.value.length / itemsPerPage)
)

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCategories.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)

onMounted(fetchCategories)
</script>