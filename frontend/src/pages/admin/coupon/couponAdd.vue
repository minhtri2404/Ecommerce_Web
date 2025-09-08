<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />
        <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl">
            <!-- Header -->
            <div class="flex justify-between items-center border-b px-6 py-4">
                <h2 class="text-lg font-semibold">Thêm mã giảm giá mới</h2>
                <button @click="$router.back()" class="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            <!-- Body -->
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
                <!-- Code -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Mã giảm giá</label>
                    <input
                        v-model="newCoupon.code"
                        type="text"
                        placeholder="Nhập mã giảm giá..."
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    />
                </div>

                <!-- discountType -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Loại giảm giá</label>
                    <select
                        v-model="newCoupon.discountType"
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    >
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Số tiền (VNĐ)</option>
                    </select>
                </div>

                <!-- Discount Value -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">
                        {{ newCoupon.discountType === 'percentage' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VNĐ)' }}
                    </label>
                    <input
                        v-model.number="newCoupon.discountValue"
                        type="number"
                        placeholder="Nhập giá trị giảm..."
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    />
                </div>

                <!-- usageLimit -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Số lượng</label>
                    <input
                        v-model="newCoupon.usageLimit"
                        type="number"
                        min="0"
                        placeholder="Nhập số lượng..."
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    />
                </div>

                <!-- StartDate -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <input
                        v-model="newCoupon.startDate"
                        type="date"
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    />
                </div>

                <!-- EndDate -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                    <input
                        v-model="newCoupon.endDate"
                        type="date"
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    />
                </div>

                <!-- minOrderAmount -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Đơn hàng tối thiểu (VNĐ)</label>
                    <input
                        v-model.number="newCoupon.minOrderAmount"
                        type="number"
                        min="0"
                        placeholder="Ví dụ: 50000"
                        class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                    />
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end items-center border-t px-6 py-4 gap-3">
                <button
                    @click="$router.back()"
                    class="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                    Hủy
                </button>

                <button
                    @click="handleSubmit"
                    class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Thêm mới
                </button>
            </div>
        </div>
    </div>
</template>


<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';
import Alert from '@/components/Alert/ComAlert.vue';

const router = useRouter();
const newCoupon = ref({
    code: '',
    discountType: 'percentage', // 'percentage' or 'fixed'
    discountValue: 0,
    usageLimit: 0,
    startDate: '',
    endDate: '',
    minOrderAmount: 0
});


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


// Gọi API để nhấn thêm mã giảm giá
const handleSubmit = async() => {
    try {
        const res = await axios.post('http://localhost:4000/api/coupon/add', newCoupon.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (res.data.success) {
            showToast('success', 'Thành công', res.data.message);
            setTimeout(() => {
                router.push('/admin-dashboard/coupon');
            }, 2000);
        } else{
            showToast('error', 'Thất bại', res.data.message)
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            // ✅ Hiển thị message đúng từ backend
            showToast('error', 'Thất bại', error.response.data.message);
        } else {
            // fallback nếu lỗi không mong muốn
            showToast('error', 'Lỗi', 'Server Error');
        }
    }
}

</script>