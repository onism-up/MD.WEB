<template>
    <el-dialog v-model="dialogVisible" :show-close="false" center title="导入数据" width="300px">
        <el-upload v-if="dialogVisible" ref="upload" class="upload" accept=".json" :show-file-list="false"
            :before-upload="beforUpload" :on-success="onSuccess" :on-error="onError"
            :action="`${ServerPath}/upload_append`" :limit="1" :on-exceed="handleExceed" :headers="{
                token: cache.getItem('token')
            }" :auto-upload="false" :on-change="onFileChange">
            <template #trigger>
                <el-button :type="fileSelect ? 'warning' : 'info'" class="upload_slc">{{ fileSelect ? '已选择,单击重选' :
                        "选择文件"
                }}</el-button>
            </template>
            <el-button type="success" class="upload_up" @click="submitUpload" :disabled="!fileSelect">
                上传文件
            </el-button>
        </el-upload>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { DialogControl } from "@/tools/elm"
import { ElMessage, genFileId } from 'element-plus';
import { ServerPath } from "@/const";
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import cache from '@/cache';
import { useStore } from 'vuex';
const loading = ref(false)

const fileSelect = ref(false)

const store = useStore()

const props = defineProps<{
    use?: DialogControl,
}>()

const dialogVisible = ref(false)

watch(dialogVisible, () => {
    loading.value = false
    fileSelect.value = false
})


if (props.use) {
    props.use.close = () => dialogVisible.value = false
    props.use.open = () => dialogVisible.value = true
}




const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

const submitUpload = () => {
    upload.value!.submit()
}

type ResultType = {
    status: boolean
    message: string
}

const onSuccess: UploadProps['onSuccess'] = (rsp: ResultType) => {
    if (rsp.status) {
        ElMessage.info('文件已成功导入')
        store.dispatch("setFileList")
        if (store.state.checkMDId) store.dispatch("setFileDetail", store.state.checkMDId)
    } else {
        ElMessage.info("上传出错: " + rsp.message)
    }

}

const onError: UploadProps['onError'] = () => {
    ElMessage.info('文件上传中出现了错误，请稍后再试')
}

const beforUpload: UploadProps['beforeUpload'] = () => {
    fileSelect.value = false
}



const onFileChange: UploadProps['onChange'] = (file) => {
    if (file.status === "ready") {
        if (file.raw && file.raw.type === 'application/json') {
            fileSelect.value = true
        } else {
            ElMessage.info("选择了错误的文件格式")
            fileSelect.value = false
        }
    }
}
</script>
<style scoped lang="scss">
.dialog-footer button:first-child {
    margin-right: 10px;
}

.del_info {
    text-align: center;
    display: block;
}

.upload {
    display: flex;
    justify-content: center;

    .upload_slc {
        margin-right: 30px;
    }
}
</style>