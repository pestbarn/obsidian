import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import Vue2TouchEvents from 'vue2-touch-events'
import Helpers from './helpers.js'
import VueKatex from 'vue-katex'

Vue.use(VueRouter)
Vue.use(Vue2TouchEvents, {
    swipeTolerance: 120
})
Vue.use(Meta, {
    refreshOnceOnNavigation: true
})
Vue.use(Helpers)

import Home from './components/Home.vue'
import Beer from './components/Beer.vue'
import Tools from './components/Tools.vue'
import './main.scss'
import 'katex/dist/katex.min.css'

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
    },
    {
        path: '/tools',
        name: 'tools',
        component: Tools
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

Vue.use(VueKatex, {
    globalOptions: {
        strict: false,
        trust: true
    }
})

new Vue({
    el: '#app',
    components: {
        App
    },
    template: '<App/>',
    router
})
