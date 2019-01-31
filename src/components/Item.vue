<template>
    <div
        class="item"
        :class="{ 'is-active': selected }"
        @click="$emit('click')">
        <h1 class="title">{{title}}</h1>
        <p class="subtitle">{{subtitle}}</p>
        <p class="meta">{{meta}}</p>
    </div>
</template>

<script>
export default {
    name: 'Item',
    props: {
        uid: String,
        title: String,
        subtitle: String,
        meta: String,
        selected: Boolean,
    }
}
</script>

<style lang="scss" scoped>
.item {
    display: block;
    border-bottom: 1px solid whitesmoke;
    padding: 1em;
    cursor: pointer;

    &.is-active {
        background-color: #eee;
    }

    .title {
        font-size: .8em;
    }
    .subtitle {
        font-size: .7em;
        margin-bottom: 2px;
    }
    .meta {
        font-size: .7em;
        color: #888;
    }
}
</style>
