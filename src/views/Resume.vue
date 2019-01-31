<template>
    <div class="resume">
        <section class="hero is-fullheight">
            <div class="hero-body has-text-centered">
                <div class="column">
                    <div class="box">
                        <h1 class="title">Resumen</h1>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'Resume',
}
</script>

<style lang="scss" scoped>
.resume {
    .box {
        border: 0;
        background: none;
        box-shadow: none;

        .title {
            font-size: 2.4em;
            font-weight: 500;
            color: #ccc;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
    }
}
</style>