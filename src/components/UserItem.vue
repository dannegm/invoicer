<template>
    <div class="user-item">
        <figure v-if="photoURL != null">
            <img :src="photoURL" />
        </figure>
        <figure v-else>
            <img :src="photoPlaceholder" />
        </figure>

        <div class="user-info">
            <span class="title">{{name}}</span>
            <span class="subtitle">{{email}}</span>
        </div>

        <div class="user-actions">
            <a v-if="canRemove" class="delete is-small" @click.stop="$emit('trash', uid)"></a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserItem',
    props: {
        uid: String,
        name: String,
        email: String,
        photoURL: String,
        canRemove: Boolean,
    },
    data () {
        return {
            photoPlaceholder: `${process.env.BASE_URL}img/avatar-placeholder.png`,
        }
    }
}
</script>

<style lang="scss">
.user-item {
    display: flex;
    flex-direction: row;
    padding: 0.5em 0;

    figure {
        display: block;
        width: 36px;
        height: 36px;
        flex: none;
        border-radius: 50%;
        overflow: hidden;
    }

    .user-info {
        display: block;
        margin-left: 0.8em;
        flex-grow: 1;

        span {
            display: block;
        }
        .title {
            font-size: 1em;
        }
        .subtitle {
            font-size: 0.8em;
        }
    }
}
</style>
