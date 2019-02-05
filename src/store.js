import Vue from 'vue';
import Vuex from 'vuex';
import { auth, db } from '@/services/firebase';

Vue.use(Vuex);

const photoPlaceholder = `${process.env.BASE_URL}img/avatar-placeholder.png`;

export default new Vuex.Store({
    state: {
        loading: true,
        auth: {
            is: false,
            uid: null,
            unauthorized: false,
        },
        user: {
            photoURL: photoPlaceholder,
            email: '',
        },
        invoices: [],
    },
    mutations: {
        loading (state, isLoading) {
            state.loading = isLoading;
        },
        login (state, user) {
            state.user = user;
            if (user.photoURL == null) {
                state.user.photoURL = photoPlaceholder;
            }

            state.auth = {
                is: true,
                uid: user.uid,
                unauthorized: user.unauthorized,
            };
        },
        logout (state) {
            state.user = {
                photoURL: photoPlaceholder,
                email: '',
            };
            state.auth = {
                is: false,
                uid: null,
                unauthorized: false,
            };
        },
        storeInvoice (state, invoice) {
            state.invoices.push (invoice);
        },
        updateInvoice (state, invoice) {
            state.invoices.forEach ((item, index) => {
                if (item.uid == invoice.uid) {
                    state.invoices [index] = invoice;
                }
            });
        },
        loadInvoices (state, invoices) {
            state.invoices = invoices;
        }
    },
    actions: {
        async logout ({ commit }) {
            commit ('logout');
            await auth.signOut ();
        },
        async loadInvoices ({ commit }) {
            const invoicesSnapshot = await db.collection ('invoices').get ();
            const invoices = invoicesSnapshot.docs.map (doc => doc.data());

            commit('loadInvoices', invoices);
            commit('loading', false);
        },
        async saveInvoice ({ commit, state }, invoice) {
            await db.collection ('invoices').doc (invoice.uid).set (invoice);
            if (!state.invoices.some(i => i.uid == invoice.uid)) {
                commit ('storeInvoice', invoice);
            } else {
                commit ('updateInvoice', invoice);
            }
        },
    }
})
