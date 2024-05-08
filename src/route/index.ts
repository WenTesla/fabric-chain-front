import {createRouter, createWebHistory} from 'vue-router'
import register from '../view/register.vue'
import login from '../view/login.vue'
import not_found from '../view/not-found/index.vue'
import user_manage from '../view/user_manage.vue'
import cert from "~/view/cert.vue";
import csr from "~/view/csr.vue";
import interCert from "~/view/interCert.vue";
import apply_cert from "~/view/apply-cert.vue";
import apply_inter_cert from "~/view/apply-inter-cert.vue"
import verity_cert from "~/view/verity-cert.vue"
import back from "~/view/back.vue";
import my_cert from "~/view/my-cert.vue";

const routerHistory = createWebHistory()


const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/register',
            component: register
        },
        {
            path: '/login',
            component: login
        },
        {
            path: '/404',
            component: not_found,
        },
        {
            path: '/user',
            component: user_manage,

        },
        {
            path: '/user/:id',
            component: user_manage,

        },
        {
            path: '/interCert',
            component: interCert,
        },
        {
            path: '/csr',
            component: csr
        },
        {
            path: '/cert',
            component: cert
        },
        {
            path: '/apply_cert',
            component: apply_cert
        },
        {
            path: '/apply_inter',
            component: apply_inter_cert
        },
        {
            path: '/verity_cert',
            component: verity_cert
        },
        {
            path: '/back',
            component: back
        },
        {
            path: '/my_cert',
            component: my_cert
        }
        // {
        //     path: '*',
        //     redirect: '/404'
        // }
    ]
})

export default router;
