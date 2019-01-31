<template>
    <nav class="navbar has-shadow is-fixed-top">
        <div
            v-if="dropdown.open"
            class="overlay"
            @click="dropdown.open = false">
        </div>

        <div class="container is-fluid">
            <div class="navbar-brand">
                <div class="navbar-item">
                    <h1 class="title">Invoicer</h1>
                </div>

                <div class="navbar-burger burger" data-target="navMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div id="navMenu" class="navbar-menu">
                <div class="navbar-end">
                    <div class="navbar-item">
                        <span class="tag is-primary">white-label</span>
                    </div>
                    <div
                        class="navbar-item has-dropdown"
                        :class="{ 'is-active': dropdown.open }">
                        <a class="navbar-link avatar" @click="dropdown.open = !dropdown.open">
                            <img :src="user.photoURL" />
                            <span>{{user.name}}</span>
                        </a>

                        <div class="navbar-dropdown">
                            <a class="navbar-item" @click="go('main.resume')">
                                <span class="icon is-small">
                                    <i class="fas fa-th-large"></i>
                                </span>
                                <span>Inicio</span>
                            </a>
                            <a class="navbar-item">
                                <span class="icon is-small">
                                    <i class="fas fa-users"></i>
                                </span>
                                <span>Usuarios</span>
                            </a>
                            <hr class="navbar-divider">
                            <a class="navbar-item" @click="requestOut">
                                <span class="icon is-small">
                                    <i class="fas fa-sign-out-alt"></i>
                                </span>
                                <span>Salir</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    methods: {
        requestOut () {
            this.$store.dispatch('logout');
        },
        go (route) {
            this.dropdown.open = false;
            this.$router.push ({ name: route })
        }
    },
    mounted () {
        document.body.classList.add ('has-navbar-fixed-top');
    },
    computed: {
        auth () {
            return this.$store.state.auth;
        },
        user () {
            return this.$store.state.user;
        },
    },
    data () {
        return {
            dropdown: {
                open: false,
            },
        }
    },
}
</script>
<style lang="scss" scoped>
.navbar {
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .avatar {
        img {
            margin-right: 0.5em;
            border-radius: 50%;
        }
    }
    .title {
        font-size: 1.2em;
        font-weight: 500;
        color: #444;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }
    .navbar-dropdown {
        .navbar-item {
            .icon {
                margin-right: 1em;
            }
        }
    }
}
</style>
