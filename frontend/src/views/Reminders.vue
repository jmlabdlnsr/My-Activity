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
          <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Pengingat</h1>
          <p class="text-slate-500 mt-1 font-medium text-sm md:text-base">Jangan lewatkan agenda penting Anda.</p>
        </div>
        <button @click="showModal = true; isEdit = false; resetForm()" class="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all text-sm md:text-base">
          Tambah Pengingat
        </button>
      </header>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <ul class="divide-y divide-slate-100">
          <li v-for="rem in reminders" :key="rem.id" class="p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition-colors gap-4">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                <Bell class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-base md:text-lg font-bold text-slate-800 leading-tight">{{ rem.title }}</h3>
                <p class="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-widest mt-1">{{ formatDateTime(rem.reminder_time) }}</p>
              </div>
            </div>
            <div class="flex space-x-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
              <button @click="editRem(rem)" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Edit2 class="w-5 h-5" />
              </button>
              <button @click="deleteRem(rem.id)" class="p-2 text-slate-400 hover:text-red-600 transition-colors">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </li>
          <li v-if="reminders.length === 0" class="p-20 text-center text-slate-400 font-medium">
            Belum ada pengingat.
          </li>
        </ul>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h2 class="text-2xl font-black text-slate-800 mb-6">{{ isEdit ? 'Edit Pengingat' : 'Tambah Pengingat Baru' }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Judul Pengingat</label>
              <input v-model="form.title" placeholder="Contoh: Kuis Matematika" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Waktu & Tanggal</label>
              <input v-model="form.reminder_time" type="datetime-local" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
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
import { Bell, Edit2, Trash2 } from 'lucide-vue-next';

const reminders = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const form = ref({ title: '', reminder_time: '' });

const fetchReminders = async () => {
    try {
        const res = await api.get('/reminders');
        reminders.value = res.data;
    } catch (error) {
        console.error(error);
    }
};

const resetForm = () => {
    form.value = { title: '', reminder_time: '' };
};

const handleSubmit = async () => {
    try {
        if (isEdit.value) {
            await api.put(`/reminders/${currentId.value}`, form.value);
        } else {
            await api.post('/reminders', form.value);
        }
        showModal.value = false;
        fetchReminders();
    } catch (error) {
        console.error(error);
    }
};

const editRem = (rem) => {
    isEdit.value = true;
    currentId.value = rem.id;
    const date = new Date(rem.reminder_time);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    form.value = { title: rem.title, reminder_time: localISOTime };
    showModal.value = true;
};

const deleteRem = async (id) => {
    if (confirm('Hapus pengingat ini?')) {
        try {
            await api.delete(`/reminders/${id}`);
            fetchReminders();
        } catch (error) {
            console.error(error);
        }
    }
};

const formatDateTime = (dt) => {
    return new Date(dt).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(fetchReminders);
</script>
