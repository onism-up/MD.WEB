<script lang="ts" setup>
import UserInit from "@/components/UserInit/index.vue"

</script>
<template>

    <div class="init">
        <div class="title">
            <h1>现在,为写者的账号进行配置</h1>
        </div>
        <div class="from">
            <UserInit jump />
        </div>
    </div>

</template>

<style lang="scss" scoped>
.init {
    width: 100vw;
    height: 100vh;

    .title {
        height: 30%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        user-select: none;
    }

    .from {
        overflow: hidden;
        padding-top: 30px;
        width: 50%;
        margin: 0 auto;
    }
}
</style>