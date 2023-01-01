<template>
    <el-dialog v-model="dialogVisible" :before-close="beforeClose" @close="beforeClose" :show-close="false" center
        title="确定关闭写者模式吗？关闭之后需要重新登录" width="30%">
        <span class="del_info">提示:退出后将重载主页</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="Exit" :loading="loading">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { DialogControl } from "@/tools/elm"
import cache from '@/cache';

const loading = ref(false)

const props = defineProps<{
    use?: DialogControl,
}>()

const dialogVisible = ref(false)

watch(dialogVisible, () => {
    loading.value = false
})


const Exit = async () => {
    cache.setItem('token', "")
    location.replace(location.origin)
}

if (props.use) {
    props.use.close = () => dialogVisible.value = false
    props.use.open = () => dialogVisible.value = true
}

const beforeClose = (close?: Function) => {
    if (props.use && props.use.callback.length) {
        props.use.callback.forEach((item) => item(true, null))
    }
    close && close()
}

</script>
<style scoped>
.dialog-footer button:first-child {
    margin-right: 10px;
}

.del_info {
    text-align: center;
    display: block;
}
</style>