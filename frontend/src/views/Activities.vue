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
          <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Aktivitas Harian</h1>
          <p class="text-slate-500 mt-1 font-medium text-sm md:text-base">Catat dan tinjau kegiatan harian Anda.</p>
        </div>
        <button @click="showModal = true; isEdit = false; resetForm()" class="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all text-sm md:text-base">
          Catat Aktivitas
        </button>
      </header>

      <div class="space-y-6">
        <div v-for="act in activities" :key="act.id" class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-l-8 border-indigo-500 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-all gap-6">
          <div class="flex-grow">
            <h3 class="text-xl md:text-2xl font-black text-slate-800 mb-2 leading-tight">{{ act.activity_title }}</h3>
            <p class="text-slate-600 font-medium mb-4 text-sm md:text-base leading-relaxed">{{ act.description }}</p>
            <div class="flex items-center text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider">
               <Calendar class="w-4 h-4 mr-2" />
               <span>{{ formatDate(act.activity_date) }}</span>
            </div>
          </div>
          <div class="flex space-x-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50">
            <button @click="editAct(act)" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Edit2 class="w-6 h-6" />
            </button>
            <button @click="deleteAct(act.id)" class="p-2 text-slate-400 hover:text-red-600 transition-colors">
              <Trash2 class="w-6 h-6" />
            </button>
          </div>
        </div>
        <div v-if="activities.length === 0" class="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p class="text-slate-400 font-medium text-base md:text-lg">Belum ada aktivitas yang dicatat.</p>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h2 class="text-2xl font-black text-slate-800 mb-6">{{ isEdit ? 'Edit Aktivitas' : 'Catat Aktivitas Baru' }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Judul Aktivitas</label>
              <input v-model="form.activity_title" placeholder="Contoh: Belajar Kelompok" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
              <textarea v-model="form.description" rows="3" placeholder="Apa yang Anda lakukan?" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Tanggal</label>
              <input v-model="form.activity_date" type="date" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
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
import { Calendar, Edit2, Trash2 } from 'lucide-vue-next';

const activities = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const form = ref({ activity_title: '', description: '', activity_date: '' });

const fetchActivities = async () => {
    try {
        const res = await api.get('/daily-activities');
        activities.value = res.data;
    } catch (error) {
        console.error(error);
    }
};

const resetForm = () => {
    form.value = { activity_title: '', description: '', activity_date: '' };
};

const handleSubmit = async () => {
    try {
        if (isEdit.value) {
            await api.put(`/daily-activities/${currentId.value}`, form.value);
        } else {
            await api.post('/daily-activities', form.value);
        }
        showModal.value = false;
        fetchActivities();
    } catch (error) {
        console.error(error);
    }
};

const editAct = (act) => {
    isEdit.value = true;
    currentId.value = act.id;
    let formattedDate = '';
    if (act.activity_date) {
        formattedDate = typeof act.activity_date === 'string' ? act.activity_date.split('T')[0] : new Date(act.activity_date).toISOString().split('T')[0];
    }
    form.value = { 
        activity_title: act.activity_title, 
        description: act.description, 
        activity_date: formattedDate 
    };
    showModal.value = true;
};

const deleteAct = async (id) => {
    if (confirm('Hapus aktivitas ini?')) {
        try {
            await api.delete(`/daily-activities/${id}`);
            fetchActivities();
        } catch (error) {
            console.error(error);
        }
    }
};

const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

onMounted(fetchActivities);
</script>
