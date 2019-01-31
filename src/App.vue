<template>
    <div id="app">
        <router-view name="main" />
    </div>
</template>

<script>
export default {
    methods: {
        redirect () {
            if (this.$router.currentRoute.name == 'main') {
                this.$router.push ({ name: 'main.resume' });
            }
        },
    },
    mounted () {
        this.redirect ();
    },
    watch: {
        $route () {
            this.redirect ();
        },
    },
}
</script>
