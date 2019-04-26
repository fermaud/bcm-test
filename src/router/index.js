import Vue from 'vue';
import Router from 'vue-router';
import Flights from '@/components/Flights';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Flights',
            component: Flights
        }
    ]
});
