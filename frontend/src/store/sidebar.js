import { ref } from 'vue';

export const isSidebarOpen = ref(true);

export function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
}
