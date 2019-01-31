<template>
    <div class="main">
        <Loading :show="loading" />
        <Login />

        <div v-if="auth.is && !auth.unauthorized" class="dashboard">
            <Navbar />
            <div class="columns is-gapless">
                <div class="is-sidebar column is-one-quarter">
                    <Sidebar />
                </div>
                <div class="column is-three-quarters hero has-background-light is-fullheight">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { firebase, db, auth } from '@/services/firebase';

import Login from '@/views/Login';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default {
    name: 'Main',
    components: {
        Login,
        Loading,
        Navbar,
        Sidebar,
    },
    async mounted () {
        document.title = this.title;
        this.$store.dispatch('loadInvoices');
    },
    computed: {
        loading () {
            return this.$store.state.loading;
        },
        auth () {
            return this.$store.state.auth;
        },
        user () {
            return this.$store.state.user;
        },
    },
    data () {
        return {
            title: 'Invoicer',
            currentRoute: null,
            routes: {
                ['main']: {
                    name: 'main',
                    displayName: 'Main',
                    selected: false,
                },
                ['main.resume']: {
                    name: 'main.resume',
                    displayName: 'Resumen',
                    selected: false,
                },
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.main {
    .is-sidebar {
        border-right: 1px solid whitesmoke;
    }
}
</style>

