<template>
  <div class="flex bg-slate-50 min-h-screen font-sans">
    <Sidebar />
    <main 
      :class="[
        'flex-grow p-4 md:p-8 lg:p-10 overflow-y-auto transition-all duration-300 min-h-screen',
        isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20',
        'ml-0'
      ]"
    >
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Jadwal Kuliah</h1>
          <p class="text-slate-500 mt-1 font-medium text-sm md:text-base">Kelola jadwal perkuliahan mingguan Anda.</p>
        </div>
        <button @click="showModal = true" class="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all text-sm md:text-base">
          Tambah Jadwal
        </button>
      </header>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 md:px-8 py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Mata Kuliah</th>
                <th class="px-6 md:px-8 py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Hari</th>
                <th class="px-6 md:px-8 py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Waktu</th>
                <th class="px-6 md:px-8 py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Lokasi</th>
                <th class="px-6 md:px-8 py-4 text-left text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-for="item in schedules" :key="item.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 md:px-8 py-5 text-slate-800 font-semibold text-sm md:text-base whitespace-nowrap">{{ item.course_name }}</td>
                <td class="px-6 md:px-8 py-5 text-slate-600 text-sm md:text-base whitespace-nowrap">{{ translateDay(item.day) }}</td>
                <td class="px-6 md:px-8 py-5 text-slate-600 font-mono text-sm md:text-base whitespace-nowrap">{{ item.start_time.substring(0,5) }} - {{ item.end_time.substring(0,5) }}</td>
                <td class="px-6 md:px-8 py-5 text-slate-600 text-sm md:text-base whitespace-nowrap">{{ item.location }}</td>
                <td class="px-6 md:px-8 py-5 whitespace-nowrap">
                  <button @click="deleteItem(item.id)" class="text-red-500 hover:text-red-700 font-bold text-sm">Hapus</button>
                </td>
              </tr>
              <tr v-if="schedules.length === 0">
                <td colspan="5" class="px-8 py-12 text-center text-slate-400 font-medium">Belum ada jadwal yang ditambahkan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h2 class="text-2xl font-black text-slate-800 mb-6">Tambah Jadwal Baru</h2>
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Nama Mata Kuliah</label>
              <input v-model="form.course_name" placeholder="Contoh: Pemrograman Web" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Hari</label>
              <select v-model="form.day" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required>
                <option value="Monday">Senin</option>
                <option value="Tuesday">Selasa</option>
                <option value="Wednesday">Rabu</option>
                <option value="Thursday">Kamis</option>
                <option value="Friday">Jumat</option>
                <option value="Saturday">Sabtu</option>
                <option value="Sunday">Minggu</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Jam Mulai</label>
                <input v-model="form.start_time" type="time" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Jam Selesai</label>
                <input v-model="form.end_time" type="time" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Lokasi / Ruangan</label>
              <input v-model="form.location" placeholder="Contoh: Lab Komputer 1" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button @click="showModal = false" type="button" class="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Batal</button>
              <button type="submit" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import api from '../services/api';
import { isSidebarOpen } from '../store/sidebar';

const schedules = ref([]);
const showModal = ref(false);
const form = ref({ course_name: '', day: 'Monday', start_time: '', end_time: '', location: '' });

const translateDay = (day) => {
    const days = {
        'Monday': 'Senin',
        'Tuesday': 'Selasa',
        'Wednesday': 'Rabu',
        'Thursday': 'Kamis',
        'Friday': 'Jumat',
        'Saturday': 'Sabtu',
        'Sunday': 'Minggu'
    };
    return days[day] || day;
};

const fetchSchedules = async () => {
    try {
        const res = await api.get('/schedules');
        schedules.value = res.data;
    } catch (error) {
        console.error(error);
    }
};

const handleSubmit = async () => {
    try {
        await api.post('/schedules', form.value);
        showModal.value = false;
        form.value = { course_name: '', day: 'Monday', start_time: '', end_time: '', location: '' };
        fetchSchedules();
    } catch (error) {
        console.error(error);
    }
};

const deleteItem = async (id) => {
    if (confirm('Hapus jadwal ini?')) {
        try {
            await api.delete(`/schedules/${id}`);
            fetchSchedules();
        } catch (error) {
            console.error(error);
        }
    }
};

onMounted(fetchSchedules);
</script>
