import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
import Vue2TouchEvents from 'vue2-touch-events';

Vue.use(VueRouter);
Vue.use(Vue2TouchEvents);
Vue.use(Meta, {
    refreshOnceOnNavigation: true
});

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
