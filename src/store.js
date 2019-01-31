import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from '@/services/firebase';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loading: true,
        auth: {
            is: false,
            uid: null,
            unauthorized: false,
        },
        user: {
            photoURL: `${process.env.BASE_URL}img/avatar-placeholder.png`,
        },
    },
    mutations: {
        loading (state, isLoading) {
            state.loading = isLoading;
        },
        login (state, user) {
            state.user = user;
            state.auth = {
                is: true,
                uid: user.uid,
                unauthorized: user.unauthorized,
            };
        },
        logout (state) {
            state.user = {
                photoURL: `${process.env.BASE_URL}img/avatar-placeholder.png`,
            };
            state.auth = {
                is: false,
                uid: null,
                unauthorized: false,
            };
        }
    },
    actions: {
        async logout ({ commit }) {
            commit ('logout');
            await auth.signOut ();
        },
    }
})
