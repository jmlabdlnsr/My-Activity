<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
    <div class="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang!</h2>
        <p class="text-slate-500 mt-2 font-medium">Masuk untuk mengelola aktivitas Anda</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Alamat Email</label>
          <input v-model="email" type="email" placeholder="nama@contoh.com" 
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all" required />
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">Kata Sandi</label>
          <input v-model="password" type="password" placeholder="••••••••" 
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all" required />
        </div>
        <button type="submit" 
          class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transform active:scale-[0.98] transition-all">
          Masuk Sekarang
        </button>
      </form>

      <div class="mt-8 pt-8 border-t border-slate-100 text-center">
        <p class="text-slate-600 font-medium">Belum punya akun? 
          <router-link to="/register" class="text-indigo-600 font-bold hover:underline">Buat Akun Baru</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
    try {
        const response = await api.post('/auth/login', { email: email.value, password: password.value });
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/dashboard');
    } catch (error) {
        alert(error.response?.data?.message || 'Email atau password salah!');
    }
};
</script>
