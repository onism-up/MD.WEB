<template>
    <el-dialog v-model="dialogVisible" :title="title" width="30%" center :show-close="false">
        <div @keydown="inputEnter">
            <el-input v-model="input" :placeholder="placeholder" :disabled="loading" />
        </div>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import { DialogControl, isChinese } from "@/tools/elm"
import { getFileDetial, getSaveDetial, FileDetialType } from "@/ajax/api"
import { useStore } from 'vuex';

const loading = ref(true)

const placeholder = ref("加载中")

const input = ref("")

const dialogVisible = ref(false)

const props = defineProps<{
    use?: DialogControl,
    fileId: string
}>()

const store = useStore()


const title = ref("为文档修改名称")

watch(dialogVisible, (value) => {
    if (!value) {
        nextTick(() => {
            loading.value = true
            placeholder.value = "加载中"
            input.value = ""
            fileDetial.value = undefined
            title.value = "为文档修改名称"
        })
    } else {
        setFileDetial()
    }
})

const checkValue = () => {
    let lenTitle = input.value.length

    input.value.split("").forEach(item => {
        if (isChinese(item)) {
            lenTitle += 2
        }
    })

    if (lenTitle <= 0 || lenTitle > 27) {
        title.value = "名称长度应控制在0~27以内,一个中文占3个字符"
        return false
    } else {
        return true
    }
}


const inputEnter = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && fileDetial.value && checkValue()) {
        fileDetial.value.title = input.value
        title.value = "修改中..."
        loading.value = true
        try {
            await getSaveDetial(fileDetial.value)

            title.value = "成功"
            store.dispatch('setFileList')
            store.dispatch('setFileDetail', fileDetial.value.id)
            setTimeout(() => {
                dialogVisible.value = false
            }, 300)
        } catch {
            title.value = "修改失败，请稍后重试"
        }
    }

}

const fileDetial = ref<FileDetialType | undefined>()

const setFileDetial = async () => {
    if (props.fileId.length > 0) {
        fileDetial.value = await getFileDetial(props.fileId) as unknown as FileDetialType
        loading.value = false
        placeholder.value = "请填写文件名称"
        input.value = fileDetial.value.title
    } else {
        placeholder.value = "意外错误，请稍后重试"
    }

}







const showDialog = () => {
    dialogVisible.value = true
}

const close = () => {
    dialogVisible.value = false
}

if (props.use) {
    props.use.close = close
    props.use.open = showDialog
}




</script>
<style scoped lang="scss">

</style>