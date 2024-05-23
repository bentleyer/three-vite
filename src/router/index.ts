import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/three',
            name: 'three',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/three/start.vue')
        },
        {
            path: '/example',
            name: 'example',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/three/example/index.vue')
        },
        {
            path: '/matrix',
            name: 'matrix',
            component: () => import('@/views/three/matrix/index.vue')
        },
        {
            path: '/shadow',
            name: 'shadow',
            component: () => import('@/views/three/shadow/index.vue')
        },
        {
            path: '/shadowCar',
            name: 'shadowCar',
            component: () => import('@/views/three/shadowCar/index.vue')
        },
        {
            path: '/pathFinding',
            name: 'pathFinding',
            component: () => import('@/views/three/pathFinding/index.vue')
        },
        {
            path: '/lasvism',
            name: 'lasvism',
            component: () => import('@/views/three/lasvism/index.vue')
        },
        {
            path: '/MCVE',
            name: 'MCVE',
            component: () => import('@/views/three/MCVE/index.vue')
        },
        {
            path: '/postprocessing',
            name: 'postprocessing',
            component: () => import('@/views/three/postprocessing/index.vue')
        }
    ]
});

export default router;
