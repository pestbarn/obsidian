import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './components/Home.vue';
import Beer from './components/Beer.vue';
import './main.scss';

const routes = [
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        component: Home
    },
    {
        path: '/beer/:slug',
        name: 'beer',
        component: Beer
    }
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    components: {
        App
    },
    template: '<App/>',
    router
});
