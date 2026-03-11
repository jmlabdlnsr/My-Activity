import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Schedules from '../views/Schedules.vue';
import Tasks from '../views/Tasks.vue';
import Reminders from '../views/Reminders.vue';
import Activities from '../views/Activities.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { 
        path: '/dashboard', 
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    { path: '/schedules', component: Schedules, meta: { requiresAuth: true } },
    { path: '/tasks', component: Tasks, meta: { requiresAuth: true } },
    { path: '/reminders', component: Reminders, meta: { requiresAuth: true } },
    { path: '/activities', component: Activities, meta: { requiresAuth: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('accessToken');
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
