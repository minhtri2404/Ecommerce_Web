<template>
  <div class="content">
    <!-- Alert Toast -->
    <Alert
      v-model="showAlert"
      :type="alertType"
      :title="alertTitle"
      :message="alertMessage"
      :duration="3000"
    />

    <div class="px-5">
      <div class="my-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="bg-white shadow rounded-lg">
                <div class="p-6" v-if="order">
                  <!-- Order Info -->
                  <div class="invoice-title">
                    <h4 class="float-end text-base font-medium">
                      {{ order._id }}
                      <!-- Trạng thái -->
                      <span
                        v-if="order.status === 'Đã Giao Hàng'"
                        class="ml-2 px-2 py-1 text-xs rounded bg-green-500 text-white"
                      >Đã Giao Hàng</span>

                      <span
                        v-else-if="order.status === 'Đã Hủy'"
                        class="ml-2 px-2 py-1 text-xs rounded bg-red-500 text-white"
                      >Đã Hủy</span>

                      <span
                        v-else-if="order.status === 'Chờ Xác Nhận'"
                        class="ml-2 px-2 py-1 text-xs rounded bg-yellow-500 text-white"
                      >Chờ Xác Nhận</span>

                      <span
                        v-else-if="order.status === 'Đang Vận Chuyển'"
                        class="ml-2 px-2 py-1 text-xs rounded bg-blue-400 text-white"
                      >Đang Vận Chuyển</span>

                      <span
                        v-else-if="order.status === 'Đã Xác Nhận'"
                        class="ml-2 px-2 py-1 text-xs rounded bg-indigo-500 text-white"
                      >Đã Xác Nhận, Đang Chờ Vận Chuyển</span>
                    </h4>
                    <div class="mb-4">
                      <h2 class="text-lg text-gray-500">Thông Tin Đơn Hàng</h2>
                    </div>
                  </div>

                  <hr class="my-4" />

                  <!-- Customer & Payment Info -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="text-gray-600">
                      <h5 class="text-lg font-semibold mb-3">Thông Tin Khách Hàng</h5>
                      <p class="mb-1"><span class="font-semibold">Họ và tên:</span> {{ order.shippingAddress?.fullName }}</p>
                      <p class="mb-1"><span class="font-semibold">Địa chỉ:</span>
                        {{ order.shippingAddress?.address }},
                        {{ order.shippingAddress?.city }},
                        {{ order.shippingAddress?.country }}
                      </p>
                      <p class="mb-1"><span class="font-semibold">Email:</span> {{ order.user?.email }}</p>
                      <p><span class="font-semibold">SĐT:</span> {{ order.shippingAddress?.phone }}</p>
                    </div>

                    <div class="text-gray-600 text-right">
                      <div>
                        <h5 class="text-base font-medium">Phương Thức Thanh Toán</h5>
                        <p>{{ order.paymentMethod }}</p>
                      </div>
                      <div class="mt-4">
                        <h5 class="text-base font-medium">Ngày Đặt Hàng</h5>
                        <p>{{ formatDate(order.createdAt) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Update Status -->
                  <div class="mt-6">
                    <h5 class="mb-2">Thay Đổi Trạng Thái Đơn Hàng</h5>
                    <select
                      v-model="selectedStatus"
                      @change="updateStatus"
                      class="border rounded px-3 py-2 w-1/3"
                    >
                      <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                        {{ status.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Product Table -->
                  <div class="py-4">
                    <h5 class="text-base font-semibold mb-3">Thông Tin Sản Phẩm</h5>
                    <div class="overflow-x-auto">
                      <table class="min-w-full border border-gray-200 text-sm">
                        <thead class="bg-gray-100">
                          <tr>
                            <th class="px-4 py-2 text-left">Ảnh</th>
                            <th class="px-4 py-2 text-left">Tên Sản Phẩm</th>
                            <th class="px-4 py-2 text-center">Giá</th>
                            <th class="px-4 py-2 text-center">Số Lượng</th>
                            <th class="px-4 py-2 text-center">Thành Tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          <!-- sản phẩm -->
                          <tr
                            v-for="(item, index) in order.products"
                            :key="index"
                            class="border-t"
                          >
                            <td class="px-4 py-2">
                              <img
                                :src="`http://localhost:4000/uploads/product/${item.product?.images?.[0]}`"
                                :alt="item.product?.name"
                                class="w-12 h-12 object-cover"
                              />
                            </td>
                            <td class="px-4 py-2">{{ item.product?.name }}</td>
                            <td class="px-4 py-2 text-center font-bold">
                              {{ formatPrice(item.price) }}
                            </td>
                            <td class="px-4 py-2 text-center">
                              {{ item.quantity }}
                            </td>
                            <td class="px-4 py-2 text-center font-bold">
                              {{ formatPrice(item.price * item.quantity) }}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <!-- giảm giá -->
                          <tr v-if="order.discountAmount > 0">
                            <td colspan="3"></td>
                            <td class="px-4 py-2 text-right text-red-500 font-bold">
                              Giảm giá: ({{ order.discountCode }})
                            </td>
                            <td class="px-4 py-2 text-center text-red-500 font-bold">
                              -{{ order.discountAmount.toLocaleString('vi-VN') }} đ
                            </td>
                          </tr>

                          <!-- tổng tiền -->
                          <tr>
                            <td colspan="3"></td>
                            <td class="px-4 py-2 text-right font-bold">Tổng Tiền</td>
                            <td class="px-4 py-2 text-center font-bold text-red-500">
                              {{ order.totalAmount.toLocaleString('vi-VN') }} đ
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <!-- Export Buttons -->
                    <div class="mt-4 text-right">
                      <button
                        class="px-4 py-2 border rounded text-red-500 border-red-500 hover:bg-red-50 mr-2"
                        @click="exportToExcel(order)"
                      >
                        Xuất Tệp Excel <i class="fa-solid fa-download"></i>
                      </button>

                      <button
                        class="px-4 py-2 border rounded text-gray-700 border-gray-700 hover:bg-gray-100"
                        @click="exportToPDF(order)"
                      >
                        Xuất Tệp PDF <i class="fa-solid fa-download"></i>
                      </button>
                    </div>
                  </div>
                  <!-- End Product Table -->
                </div>

                <div v-else class="text-center py-10 text-gray-500">
                  Đang tải đơn hàng...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Alert from '@/components/Alert/ComAlert.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const order = ref(null);
const loading = ref(true);

// ALERT state
const showAlert = ref(false);
const alertType = ref('success');
const alertTitle = ref('');
const alertMessage = ref('');

const showToast = (type, title, message) => {
  alertType.value = type;
  alertTitle.value = title;
  alertMessage.value = message;
  showAlert.value = true;
};

// Status mapping
const statusOptions = [
  { value: 'pending', label: 'Chờ Xác Nhận' },
  { value: 'confirmed', label: 'Đã Xác Nhận' },
  { value: 'shipped', label: 'Đang Vận Chuyển' },
  { value: 'delivered', label: 'Đã Giao Hàng' },
  { value: 'cancelled', label: 'Đã Hủy' }
];

// Dropdown state
const selectedStatus = ref('');

// Helper formatters
const formatPrice = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatDate = (date) =>
  new Date(date).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });


// Gọi API lấy đơn hàng
const fetchOrderById = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`http://localhost:4000/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.data.success) {
      order.value = res.data.order;
      selectedStatus.value = order.value.status; 
    } else {
      showToast('error', 'Lỗi', res.data.message || 'Không thể lấy chi tiết đơn hàng');
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Không thể tải dữ liệu.');
  } finally {
    loading.value = false;
  }
};

// Gọi API cập nhật trạng thái
const updateStatus = async () => {
  try {
    const res = await axios.patch(`http://localhost:4000/api/orders/${id}/status`,{ status: selectedStatus.value  },{ 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    });
    if (res.data.success) {
      order.value.status = selectedStatus.value;
      showToast('success', 'Thành công', res.data.message || 'Cập nhật trạng thái thành công.');
      setTimeout(() => {
        router.push('/admin-dashboard/order')
      }, 2000)
    }
  } catch (error) {
    showToast('error', 'Lỗi', error.response?.data?.error || 'Cập nhật trạng thái thất bại.');
  }
};

onMounted(fetchOrderById);
</script>
