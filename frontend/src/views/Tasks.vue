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
          <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Daftar Tugas</h1>
          <p class="text-slate-500 mt-1 font-medium text-sm md:text-base">Kelola dan pantau progres tugas akademik Anda.</p>
        </div>
        <button @click="showModal = true; isEdit = false; resetForm()" class="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all text-sm md:text-base">
          Tambah Tugas
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        <div v-for="task in tasks" :key="task.id" class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-t-4 hover:shadow-xl transition-all" :class="task.status === 'done' ? 'border-green-500' : 'border-yellow-500'">
          <div class="flex justify-between items-start mb-4 gap-2">
            <h3 class="text-lg md:text-xl font-bold text-slate-800" :class="{'line-through text-slate-400': task.status === 'done'}">{{ task.title }}</h3>
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0" :class="task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
              {{ task.status === 'done' ? 'Selesai' : 'Pending' }}
            </span>
          </div>
          <p class="text-slate-600 mb-6 text-sm md:text-base line-clamp-3 leading-relaxed">{{ task.description }}</p>
          <div class="flex items-center text-xs md:text-sm text-slate-400 font-medium mb-6">
             <Calendar class="w-4 h-4 mr-2" />
             <span>Tenggat: {{ formatDate(task.deadline) }}</span>
          </div>
          <div class="flex justify-between items-center pt-5 border-t border-slate-50">
            <button @click="toggleStatus(task)" class="text-indigo-600 hover:text-indigo-800 font-bold text-sm">
               {{ task.status === 'done' ? 'Set Pending' : 'Set Selesai' }}
            </button>
            <div class="flex space-x-3">
              <button @click="editTask(task)" class="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                <Edit2 class="w-5 h-5" />
              </button>
              <button @click="deleteTask(task.id)" class="p-1 text-slate-400 hover:text-red-600 transition-colors">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="tasks.length === 0" class="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
           <p class="text-slate-400 font-medium text-base md:text-lg">Belum ada tugas yang ditambahkan.</p>
        </div>
      </div>

      <!-- Task Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h2 class="text-2xl font-black text-slate-800 mb-6">{{ isEdit ? 'Edit Tugas' : 'Tambah Tugas Baru' }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Judul Tugas</label>
              <input v-model="form.title" placeholder="Contoh: Laporan Basis Data" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
              <textarea v-model="form.description" rows="3" placeholder="Detail tugas..." class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Tenggat Waktu</label>
              <input v-model="form.deadline" type="date" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Status</label>
              <select v-model="form.status" class="w-full border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none">
                <option value="pending">Pending</option>
                <option value="done">Selesai</option>
              </select>
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

const tasks = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const form = ref({ title: '', description: '', deadline: '', status: 'pending' });

const fetchTasks = async () => {
    try {
        const res = await api.get('/tasks');
        tasks.value = res.data;
    } catch (error) {
        console.error(error);
    }
};

const resetForm = () => {
    form.value = { title: '', description: '', deadline: '', status: 'pending' };
};

const handleSubmit = async () => {
    try {
        if (isEdit.value) {
            await api.put(`/tasks/${currentId.value}`, form.value);
        } else {
            await api.post('/tasks', form.value);
        }
        showModal.value = false;
        fetchTasks();
    } catch (error) {
        console.error(error);
    }
};

const editTask = (task) => {
    isEdit.value = true;
    currentId.value = task.id;
    let formattedDate = '';
    if (task.deadline) {
        formattedDate = typeof task.deadline === 'string' ? task.deadline.split('T')[0] : new Date(task.deadline).toISOString().split('T')[0];
    }
    form.value = { 
        title: task.title, 
        description: task.description, 
        deadline: formattedDate, 
        status: task.status 
    };
    showModal.value = true;
};

const toggleStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'pending' : 'done';
    const formattedDate = task.deadline ? (typeof task.deadline === 'string' ? task.deadline.split('T')[0] : new Date(task.deadline).toISOString().split('T')[0]) : null;
    try {
        await api.put(`/tasks/${task.id}`, { 
            title: task.title,
            description: task.description,
            deadline: formattedDate,
            status: newStatus 
        });
        fetchTasks();
    } catch (error) {
        console.error(error);
    }
};

const deleteTask = async (id) => {
    if (confirm('Hapus tugas ini?')) {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
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

onMounted(fetchTasks);
</script>
