<template>
    <el-dialog v-model="dialogVisible" :show-close="false" center
        :title="`确定删除名为 “${title.length > 5 ? `${title.slice(0, 5)}...` : title}” 的文件吗`" width="30%">
        <span class="del_info">提示:此操作不可撤销，请谨慎操作</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="setDelFile" :loading="loading">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { DialogControl } from "@/tools/elm"
import { getDelFile } from "@/ajax/api"
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

const loading = ref(false)

const props = defineProps<{
    title: string,
    use?: DialogControl,
    fileId: string
}>()

const dialogVisible = ref(false)

watch(dialogVisible, () => {
    loading.value = false
})

const store = useStore()




const setDelFile = async () => {
    if (props.fileId) {
        loading.value = true
        try {
            await getDelFile(props.fileId)
            if (props.fileId === store.state.checkMDId) {
                store.commit("changeCheckMDId", '');
                store.commit("changFileDetial", null);
            }
            dialogVisible.value = false
            store.dispatch('setFileList')
            ElMessage.info("删除成功")
        } catch {
            loading.value = false
        }

    }
}

if (props.use) {
    props.use.close = () => dialogVisible.value = false
    props.use.open = () => dialogVisible.value = true
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