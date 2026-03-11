<template>
  <!-- Overlay untuk Mobile (Klik di luar sidebar untuk menutup) -->
  <div 
    v-if="isMobile && isSidebarOpen" 
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300"
    @click="toggleSidebar"
  ></div>

  <aside 
    :class="[
      'bg-slate-900 text-slate-300 h-screen flex flex-col p-4 shadow-2xl transition-all duration-300 ease-in-out fixed left-0 top-0 z-50',
      isSidebarOpen ? 'w-72 translate-x-0' : (isMobile ? '-translate-x-full w-72' : 'w-20 translate-x-0')
    ]"
  >
    <!-- Logo & Toggle Button -->
    <div class="flex items-center justify-between mb-10 px-2 mt-2">
      <div v-if="isSidebarOpen" class="flex items-center space-x-3 overflow-hidden whitespace-nowrap">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-indigo-900">
          <BookOpen class="h-6 w-6" />
        </div>
        <h2 class="text-xl font-black text-white tracking-tight uppercase">Manajer</h2>
      </div>
      <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
        <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
        <ChevronLeft v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-grow">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link :to="item.path" 
            class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-slate-800 hover:text-white"
            active-class="bg-indigo-600 !text-white shadow-lg shadow-indigo-900"
            @click="isMobile ? toggleSidebar() : null"
          >
            <span :class="['opacity-70 group-hover:opacity-100 transition-opacity', isSidebarOpen ? 'mr-3' : 'mx-auto']">
               <component :is="item.icon" class="w-6 h-6" />
            </span>
            <span v-if="isSidebarOpen" class="font-medium whitespace-nowrap">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout -->
    <div class="mt-auto pt-6 border-t border-slate-800">
      <button @click="handleLogout" 
        class="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-semibold"
      >
        <span :class="[isSidebarOpen ? 'mr-3' : 'mx-auto']">
          <LogOut class="w-6 h-6" />
        </span>
        <span v-if="isSidebarOpen" class="whitespace-nowrap">Keluar</span>
      </button>
    </div>
  </aside>

  <!-- Tombol Floating Menu untuk Mobile saat Sidebar Tertutup -->
  <button 
    v-if="isMobile && !isSidebarOpen"
    @click="toggleSidebar"
    class="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 animate-bounce lg:hidden"
  >
    <Menu class="w-6 h-6" />
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  LayoutDashboard, Calendar, CheckSquare, Bell, ClipboardList, 
  ChevronLeft, Menu, LogOut, BookOpen 
} from 'lucide-vue-next';
import { isSidebarOpen, toggleSidebar } from '../store/sidebar';

const router = useRouter();
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024; // breakpoint lg
  // Jika di layar kecil, tutup sidebar secara default
  if (isMobile.value) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Jadwal Kuliah', path: '/schedules', icon: Calendar },
  { name: 'Tugas', path: '/tasks', icon: CheckSquare },
  { name: 'Pengingat', path: '/reminders', icon: Bell },
  { name: 'Aktivitas Harian', path: '/activities', icon: ClipboardList },
];

const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
};
</script>
