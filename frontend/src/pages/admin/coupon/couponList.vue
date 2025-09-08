<template>
    <div class="flex-1 py-10 flex flex-col justify-between">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
        <h2 class="text-2xl font-semibold text-center mb-6">Quản Lý Mã Giảm Giá</h2>

        <!-- Search && Router ADD -->
        <div class="flex justify-between items-center px-4 mb-8">
            <div class="w-full max-w-xs">
                <input
                v-model="search"
                type="text"
                placeholder="Tìm kiếm theo tên mã giảm giá"
                class="w-full px-4 py-2 border border-indigo-300 rounded focus:outline-none focus:ring focus:border-indigo-400 shadow-sm"
                />
            </div>

            <router-link
                to="/admin-dashboard/add-coupon"
                class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded shadow"
                >
                Thêm mã giảm giá
            </router-link>
        </div>

        <!-- Table -->
        <div class="w-full md:p-10 p-4">
            <div class="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                <table class="md:table-auto table-fixed w-full overflow-hidden">
                    <thead class="text-gray-900 text-sm text-left">
                        <tr>
                            <th class="px-4 py-3 font-semibold truncate">STT</th>
                            <th class="px-4 py-3 font-semibold truncate">Mã giảm giá</th>
                            <th class="px-4 py-3 font-semibold truncate">Giảm giá (%)</th>
                            <th class="px-4 py-3 font-semibold truncate">Số Lượng</th>
                            <th class="px-4 py-3 font-semibold truncate">Ngày hết hạn</th>
                            <th class="px-4 py-3 font-semibold truncate">Đơn hàng tối thiểu</th>
                            <th class="px-4 py-3 font-semibold truncate">Trạng thái</th>
                            <th class="px-4 py-3 font-semibold truncate text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-gray-500">
                        <tr
                            v-for="coupon in paginatedCoupon"
                            :key="coupon.id"
                            class="border-t border-gray-500/20"
                        >
                        <td class="px-4 py-3">{{ coupon.sno }}</td>
                        <td class="px-4 py-3">{{ coupon.code }}</td>
                        <td class="px-4 py-3">
                            <span>
                                {{ coupon.discountType === 'percentage'
                                ? coupon.discountValue + '%'
                                : coupon.discountValue.toLocaleString('vi-VN') + ' VNĐ'
                                }}
                            </span>
                        </td>
                        <td class="px-4 py-3">{{ coupon.usageLimit }}</td>
                        <td class="px-4 py-3">{{ new Date(coupon.endDate).toLocaleDateString() }}</td>
                        <td class="px-4 py-3">{{ coupon.minOrderAmount }}</td>
                        <td class="px-4 py-3">
                            <span
                                :class="{
                                    'text-green-600 font-semibold': 
                                        coupon.usedCount < coupon.usageLimit && new Date(coupon.endDate) >= new Date(),
                                    'text-red-500 font-semibold':
                                        coupon.usedCount >= coupon.usageLimit || new Date(coupon.endDate) < new Date()
                                }"
                            >
                                {{ 
                                    coupon.usedCount >= coupon.usageLimit
                                    ? 'Hết mã'
                                    : new Date(coupon.endDate) < new Date()
                                    ? 'Ngừng hoạt động'
                                    : 'Đang hoạt động'
                                }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-center">
                            <div class="flex justify-center gap-2">
                                <router-link
                                    :to="`/admin-dashboard/coupon/${coupon.id}`"
                                    class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    >
                                    Sửa
                                </router-link>
                                <button
                                    @click="deleteCoupon(coupon.id)"
                                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                    Xóa
                                </button>
                            </div>
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
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Alert from '@/components/Alert/ComAlert.vue'


const coupons = ref([])
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

// ALERT state
const showAlert = ref(false)
const alertType = ref('success')
const alertTitle = ref('')
const alertMessage = ref('')

const showToast = (type, title, message) => {
  alertType.value = type
  alertTitle.value = title
  alertMessage.value = message
  showAlert.value = true
}

// Goi API để hiển thị tất cả mã giảm giá
const fetchCoupons = async() => {
    try {
        const res = await axios.get('http://localhost:4000/api/coupon/')
        if (res && res.data && Array.isArray(res.data.coupon)) {
            coupons.value = res.data.coupon.map((coupon, index) => ({
                id: coupon._id,
                sno: index + 1,
                code: coupon.code,
                discountValue: coupon.discountValue,
                discountType: coupon.discountType,
                usageLimit: coupon.usageLimit,
                endDate: coupon.endDate,
                minOrderAmount: coupon.minOrderAmount,
                usedCount: coupon.usedCount
            }))
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showToast('error', 'Đã xảy ra lỗi khi tải dữ liệu.', error.response.data.error);
        }
    }
}


// Tìm kiếm khách hàng theo code
const filteredCoupon = computed(() =>
  coupons.value.filter(coupon =>
    coupon.code.toLowerCase().includes(search.value.toLowerCase())
  )
)

// Pagination
const totalPages = computed(() => Math.ceil(filteredCoupon.value.length / itemsPerPage))
const paginatedCoupon = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCoupon.value.slice(start, end)
})

const goToPage = page => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }
const prevPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)

onMounted(fetchCoupons)

</script>