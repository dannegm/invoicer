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
                                Inicia sesión con tu correo eletrónico para acceder al <b>dashboard</b>.
                            </p>

                            <div class="form">
                                <b-input
                                    placeholder="Email"
                                    v-model="email"
                                    type="email">
                                </b-input>

                                <b-input
                                    placeholder="Contraseña"
                                    v-model="password"
                                    type="password">
                                </b-input>

                                <button
                                    class="button is-block is-primary is-rounded"
                                    @click="requestEmailLogin">
                                    <span>
                                        Iniciar sesión
                                    </span>
                                </button>
                            </div>

                            <span class="separator or"></span>

                            <button
                                class="button is-block is-link is-google is-rounded"
                                @click="requestGoogleLogin">
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
        <section v-if="auth.is && auth.unauthorized && strategy == 'google'" class="hero is-fullheight">
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
                                class="button is-block is-link is-google is-rounded"
                                @click="requestGoogleLogin">
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
        <section v-if="auth.is && strategy == 'email'">
            <div id="firebaseui-auth-container"></div>
        </section>
    </div>
</template>

<script>
import { firebase, db, auth, ui } from '@/services/firebase';
const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider ();

export default {
    name: 'Login',
    methods: {
        async requestEmailLogin () {
            this.strategy = 'email';
            return await auth.signInWithEmailAndPassword(this.email, this.password)
            .catch(error => {
                console.log(error);
                alert(error.message);
            });
        },
        async requestGoogleLogin () {
            this.strategy = 'google';
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
                    role: firstUserFound.data().role === undefined ? 'none' : firstUserFound.data().role,
                    registered_at: firstUserFound.data().registered_at === undefined ? new Date () : firstUserFound.data().registered_at,
                    updated_at: new Date (),
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
    data () {
        return {
            strategy: 'none',
            email: '',
            password: '',
        }
    }
}
</script>

<style lang="scss">
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

        .separator {
            display: block;
            width: 100%;
            height: 1px;
            background: #ccc;
            margin-top: .5em;
            margin-bottom: 1.5em;

            &:after {
                content: "o";
                position: absolute;
                margin-top: -22px;
                margin-left: -8px;
                background: #fff;
                padding: 8px;
                color: #aaa;
            }
        }

        .is-google {
            background-color: #DF413C;
        }

        .form {
            display: block;
            width: 100%;

            .input {
                padding: 1.4em !important;

                &[type="email"] {
                    border-radius: 10px 10px 0 0;
                }
                &[type="password"] {
                    border-radius: 0 0 10px 10px;
                }
            }

            .button {
                margin: 1em auto;
            }
        }
    }
}
</style>
