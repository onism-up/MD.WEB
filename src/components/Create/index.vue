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
import { getCreateFile } from "@/ajax/api"
import { useStore } from 'vuex';

const loading = ref(false)

const placeholder = ref("此处输入文件名")

const input = ref("")

const dialogVisible = ref(false)

const props = defineProps<{
    use?: DialogControl,
}>()

const store = useStore()


const title = ref("为新建的文件命名,并且Enter确认")

watch(dialogVisible, (value) => {
    if (!value) {
        nextTick(() => {
            loading.value = false
            input.value = ""
            title.value = "为新建的文件命名,并且Enter确认"
        })
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
    if (event.key === "Enter" && checkValue()) {
        title.value = "创建中..."
        loading.value = true
        try {
            await getCreateFile(input.value)
            title.value = "创建成功"
            store.dispatch('setFileList')
            setTimeout(() => {
                dialogVisible.value = false
            }, 300)
        } catch {
            title.value = "创建失败，请稍后重试"

        }
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