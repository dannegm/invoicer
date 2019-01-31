<template>
    <div class="login">
        <section v-if="!auth.is && !auth.unauthorized" class="hero is-fullheight">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <div class="column is-4 is-offset-4">
                        <div class="box">
                            <figure class="avatar icon">
                                <i class="fas fa-th-large"></i>
                            </figure>

                            <h3 class="title has-text-grey">Dashboard</h3>
                            <p class="subtitle has-text-grey">
                                Inicia sesión con tu cuenta de <b>Google</b> para acceder al <b>dashboard</b>.
                            </p>
                            
                            <button
                                class="button is-block is-link is-rounded"
                                @click="requestLogin">
                                <span class="icon is-small">
                                    <i class="fab fa-google"></i>
                                </span>
                                <span>
                                    Inicia con Google
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section v-if="auth.is && auth.unauthorized" class="hero is-fullheight">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <div class="column is-4 is-offset-4">
                        <div class="box">
                            <figure class="avatar">
                                <img :src="user.photoURL" />
                            </figure>

                            <h3 class="title has-text-grey">Bienvenido</h3>
                            <p class="subtitle has-text-grey">
                                No tienes permisos para acceder al <b>dashboard</b>, por favor contacta con tu administrador.
                            </p>

                            <button
                                class="button is-block is-link is-rounded"
                                @click="requestLogin">
                                <span class="icon is-small">
                                    <i class="fab fa-google"></i>
                                </span>
                                <span>
                                    Cambiar de cuenta
                                </span>
                            </button>
                            <button
                                class="button is-danger is-inverted"
                                @click="requestOut">Cerrar sesión</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { firebase, db, auth } from '@/services/firebase';
const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider ();

export default {
    name: 'Login',
    methods: {
        async requestLogin () {
            this.$store.commit('loading', true);
            return await auth.signInWithPopup (GoogleAuthProvider)
        },
        requestOut () {
            this.$store.dispatch('logout');
        },
    },
    async mounted () {
        auth.onAuthStateChanged (async (user) => {
            this.$store.commit('loading', false);
            if (!this.auth.is) {
                const usersSnapshot = await db.collection ('users')
                    .where('email', '==', user.email).get ();
                const firstUserFound = usersSnapshot.docs[0];

                const userModel = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    role: 'none',
                    registered_at: new Date (),
                    photoURL: user.photoURL,
                    active: true,
                    unauthorized: null,
                };

                if (typeof firstUserFound == 'undefined') {
                    userModel.unauthorized = true;
                    this.$store.commit('login', userModel);
                } else {
                    userModel.unauthorized = false;
                    this.$store.commit('login', userModel);

                    if (firstUserFound.data().uid != user.uid) {
                        const tempUID = firstUserFound.data().uid;
                        await db.collection ('users').doc (tempUID).delete ();
                    }
                    await db.collection ('users').doc (user.uid).set (userModel);
                }
            }
        })
    },
    computed: {
        auth () {
            return this.$store.state.auth;
        },
        user () {
            return this.$store.state.user;
        },
    },
}
</script>

<style lang="scss" scoped>
.login {
    .box {
        border: 0;
        background: none;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar {
            display: block;
            width: 80px;
            height: 80px;
            margin-bottom: 1em;

            i {
                font-size: 3em;
                margin-top: 0.35em;
                color: #eee;
            }

            img {
                border-radius: 50%;
            }
        }

        .title {
            font-size: 1.4em;
        }
        .subtitle {
            font-size: 1em;
        }

        .is-inverted {
            margin-top: 0.65em;
        }
    }
}
</style>
