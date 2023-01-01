
<template>
  <div :data-theme="theme">
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useStore } from 'vuex';

const store = useStore()
const theme = computed<"light" | "dark">(() => store.state.theme)
</script>

<style lang="scss" >
@import "./global.scss"
</style>
