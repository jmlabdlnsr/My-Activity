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
      <!-- Header -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Dashboard</h1>
          <p class="text-slate-500 mt-1 font-medium text-sm md:text-base">
            Halo, <span class="text-indigo-600 font-bold">{{ userName }}</span>!
          </p>
        </div>
        <div class="text-left sm:text-right bg-white sm:bg-transparent p-4 sm:p-0 rounded-3xl shadow-sm sm:shadow-none border sm:border-none border-slate-100 w-full sm:w-auto">
           <p class="text-2xl md:text-3xl font-black text-slate-800 leading-tight">{{ currentTime }}</p>
           <p class="text-[10px] md:text-xs font-bold text-indigo-600 uppercase tracking-widest mt-0.5">{{ currentFullDate }}</p>
        </div>
      </header>

      <!-- Stats Quick Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <Calendar class="w-6 h-6" />
          </div>
          <div>
            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Jadwal</p>
            <p class="text-2xl font-black text-slate-800 leading-none">{{ todaySchedules.length }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
            <CheckSquare class="w-6 h-6" />
          </div>
          <div>
            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Tugas</p>
            <p class="text-2xl font-black text-slate-800 leading-none">{{ upcomingTasks.length }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
            <Bell class="w-6 h-6" />
          </div>
          <div>
            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Pengingat</p>
            <p class="text-2xl font-black text-slate-800 leading-none">{{ upcomingRemindersCount }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Kolom Kiri -->
        <div class="lg:col-span-2 space-y-6 md:space-y-8">
          
          <!-- Jadwal -->
          <section class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h2 class="text-xl md:text-2xl font-black text-slate-800">Jadwal Hari Ini</h2>
              <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">{{ currentDayName }}</span>
            </div>
            <div v-if="todaySchedules.length > 0" class="space-y-4">
              <div v-for="sch in sortedTodaySchedules" :key="sch.id" 
                :class="[
                  'flex flex-col sm:flex-row sm:items-center p-5 rounded-2xl border transition-all gap-4',
                  isOngoing(sch) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-800'
                ]"
              >
                <div :class="['w-full sm:w-24 text-left sm:text-center sm:border-r sm:pr-4', isOngoing(sch) ? 'sm:border-indigo-400' : 'sm:border-slate-200']">
                  <p :class="['text-[10px] font-black uppercase tracking-tighter mb-0.5', isOngoing(sch) ? 'text-indigo-200' : 'text-slate-400']">Waktu</p>
                  <p class="text-xl font-black leading-none">{{ sch.start_time.substring(0,5) }}</p>
                </div>
                <div class="flex-grow">
                  <h3 class="font-bold text-lg leading-snug">{{ sch.course_name }}</h3>
                  <p :class="['text-sm flex items-center mt-1 font-medium', isOngoing(sch) ? 'text-indigo-100' : 'text-slate-500']">
                    <MapPin class="w-3.5 h-3.5 mr-1.5 shrink-0" /> {{ sch.location }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="py-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
              <p class="text-slate-400 font-medium">Tidak ada kuliah hari ini.</p>
            </div>
          </section>

          <!-- Tugas -->
          <section class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 class="text-xl md:text-2xl font-black text-slate-800 mb-6">Tugas Mendesak</h2>
            <div v-if="upcomingTasks.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="task in upcomingTasks.slice(0, 4)" :key="task.id" class="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                <h3 class="font-bold text-slate-800 text-base mb-2 line-clamp-1">{{ task.title }}</h3>
                <div :class="['px-2.5 py-1 rounded-lg text-[10px] font-black uppercase w-fit mb-4', getUrgencyClass(task.deadline)]">
                   {{ getDaysLeftText(task.deadline) }}
                </div>
                <div class="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <Calendar class="w-3.5 h-3.5 mr-1.5" /> {{ formatDate(task.deadline) }}
                </div>
              </div>
            </div>
            <div v-else class="py-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
              <p class="text-slate-400 font-medium">Semua tugas beres!</p>
            </div>
          </section>
        </div>

        <!-- Kolom Kanan -->
        <div class="space-y-6 md:space-y-8">
          <!-- Pengingat -->
          <section class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 class="text-xl md:text-2xl font-black text-slate-800 mb-6">Pengingat</h2>
            <div v-if="upcomingReminders.length > 0" class="space-y-4">
              <div v-for="rem in upcomingReminders.slice(0, 3)" :key="rem.id" class="flex items-start p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                <div class="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shrink-0 mr-4 shadow-sm">
                  <Bell class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-bold text-slate-800 text-sm leading-tight">{{ rem.title }}</h3>
                  <p class="text-[10px] text-rose-600 font-bold uppercase mt-1 tracking-wider">{{ formatDateTime(rem.reminder_time) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="py-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
              <p class="text-slate-400 font-medium text-sm">Tidak ada pengingat.</p>
            </div>
          </section>

          <!-- Aktivitas Terbaru -->
          <section class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div v-if="todayActivities.length > 0" class="space-y-6">
               <div v-for="(act, idx) in todayActivities" :key="act.id" class="relative pl-8">
                  <div class="absolute left-0 top-0 h-full flex flex-col items-center">
                     <div class="w-3.5 h-3.5 rounded-full border-2 border-white bg-indigo-600 shadow-sm z-10"></div>
                     <div v-if="idx !== todayActivities.length - 1" class="w-0.5 flex-grow bg-slate-100 my-1"></div>
                  </div>
                  <h3 class="font-bold text-slate-800 text-sm leading-tight">{{ act.activity_title }}</h3>
                  <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{{ act.description }}</p>
               </div>
            </div>
            <div v-else class="py-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
              <p class="text-slate-400 font-medium">Belum ada aktivitas.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import api from '../services/api';
import { isSidebarOpen } from '../store/sidebar';
import { 
  Calendar, CheckSquare, Bell, MapPin
} from 'lucide-vue-next';

const user = ref(null);
const todaySchedules = ref([]);
const upcomingTasks = ref([]);
const todayActivities = ref([]);
const upcomingReminders = ref([]);
const currentTime = ref('');
let timer = null;

try {
    const userData = localStorage.getItem('user');
    if (userData) user.value = JSON.parse(userData);
} catch (e) {}

const userName = computed(() => user.value?.name || 'Pengguna');
const currentFullDate = computed(() => new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
const currentDayName = computed(() => ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()]);

const getTodayLocalDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const isOngoing = (sch) => {
    const d = new Date();
    const nowTime = d.getHours() * 60 + d.getMinutes();
    const [startH, startM] = sch.start_time.split(':').map(Number);
    const [endH, endM] = sch.end_time.split(':').map(Number);
    return nowTime >= (startH * 60 + startM) && nowTime <= (endH * 60 + endM);
};

const getDaysLeft = (deadline) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const dLine = new Date(deadline); dLine.setHours(0,0,0,0);
    return Math.ceil((dLine.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const getDaysLeftText = (deadline) => {
    const diff = getDaysLeft(deadline);
    if (diff === 0) return 'Hari Ini';
    if (diff < 0) return 'Terlewati';
    return `${diff} Hari Lagi`;
};

const getUrgencyClass = (deadline) => {
    const diff = getDaysLeft(deadline);
    if (diff <= 1) return 'bg-red-100 text-red-700';
    if (diff <= 3) return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
};

const sortedTodaySchedules = computed(() => [...todaySchedules.value].sort((a, b) => a.start_time.localeCompare(b.start_time)));
const upcomingRemindersCount = computed(() => upcomingReminders.value.length);

const updateClock = () => {
    currentTime.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const fetchDashboardData = async () => {
    try {
        const [sch, tsk, rem, act] = await Promise.all([
            api.get('/schedules'), api.get('/tasks'), api.get('/reminders'), api.get('/daily-activities')
        ]);
        
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = days[now.getDay()];
        
        // Filter Jadwal Hari Ini
        todaySchedules.value = (sch.data || []).filter(s => s.day === currentDay);
        
        // Filter Tugas Pending
        upcomingTasks.value = (tsk.data || []).filter(t => t.status === 'pending')
            .sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
            
        // Filter Aktivitas Hari Ini (Perbaikan Timezone)
        const todayStr = now.toDateString();
        todayActivities.value = (act.data || []).filter(a => {
            return new Date(a.activity_date).toDateString() === todayStr;
        });
        
        // Filter Pengingat Mendatang
        const nowMs = now.getTime();
        upcomingReminders.value = (rem.data || []).filter(r => new Date(r.reminder_time).getTime() > nowMs)
            .sort((a,b) => new Date(a.reminder_time) - new Date(b.reminder_time));

    } catch (error) {
        console.error('Gagal memuat data dashboard:', error);
    }
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';

const formatDateTime = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + 
           d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
    fetchDashboardData();
    updateClock();
    timer = setInterval(updateClock, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>
