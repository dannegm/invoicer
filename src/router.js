import Vue from 'vue';
import Router from 'vue-router';
import Main from './views/Main.vue';
import Resume from './views/Resume.vue';
import Invoice from './views/Invoice.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main,
            components: {
                main: Main,
            },
            children: [
                {
                    path: 'resume',
                    name: 'main.resume',
                    component: Resume,
                },
                {
                  path: '/invoice/create',
                  name: 'invoice.create',
                  component: Invoice
                },
                {
                  path: '/invoice/view/:uid',
                  name: 'invoice.view',
                  component: Invoice
                },
            ],
        },
    ],
});
