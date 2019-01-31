<template>
    <div class="item" @click="$emit('click')">
        <h1 class="title">{{label}}</h1>
        <p class="subtitle">{{uid}}</p>
    </div>
</template>

<script>
export default {
    name: 'Item',
    props: {
        uid: String,
        label: String
    }
}
</script>

<style lang="scss" scoped>
.item {
    display: block;
    border-bottom: 1px solid whitesmoke;
    padding: 1em;
    cursor: pointer;

    .title {
        font-size: .8em;
    }
    .subtitle {
        font-size: .7em;
    }
}
</style>
