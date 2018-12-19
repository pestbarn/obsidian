import Vue from 'vue';
import App from './App.vue';

import VueAnalytics from 'vue-analytics';

Vue.use(VueAnalytics, {
    id: 'UA-131192982-1'
})

new Vue({
    el: '#app',
    render: h => h(App)
});
