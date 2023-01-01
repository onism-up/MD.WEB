<script lang="ts" setup>
import IconList, { MiniList, DataListItem, DataListMiniItem } from "@/components/IconList/index.vue"
import { onMounted, computed, ref } from "vue"
import { copyText, useDialog } from "@/tools/elm"
import ChangeFileNameDalog from "@/components/ChangeFileName/index.vue"
import DelFile from "@/components/DelFile/index.vue"
import Create from "@/components/Create/index.vue"

import { useStore } from "vuex"
import { ElMessage } from "element-plus"

type FileListItemType = {
    id: string
    title: string
    creat_time: string
}

type FileListType = Array<FileListItemType>

const emit = defineEmits<{ (event: "listClick", value: DataListItem, index: number): void, (event: "miniClick", miniValue: DataListMiniItem, miniIndex: number, value: DataListItem, index: number): void }>()

defineProps<{
    height?: string
}>()

const fileListData = computed<FileListType>(() => store.state.fileList)


onMounted(() => {
    store.dispatch('setFileList')
})


const iconData = computed(() => {
    return fileListData.value.map<DataListItem>((item) => {
        const iconItem: DataListItem = {
            title: item.title,
            key: item.id,
            miniMenu: true
        }
        return iconItem
    })
})


const miniData: MiniList = [
    {
        iconPath: "/editor.png",
        login: true,
        key: "editor"
    },
    {
        iconPath: "/share.png",
        key: "share"
    },
    {
        iconPath: "/delete.png",
        login: true,
        key: "delete"
    }
]

const store = useStore()

const clickIndex = computed<number>(() => {
    if (store.state.checkMDId) {
        return fileListData.value.findIndex(({ id }) => id === store.state.checkMDId)
    } else {
        return -1
    }
})

const listClick = (value: DataListItem, index: number) => emit("listClick", value, index)

const changFileNameDalog = useDialog()

const delFileDalog = useDialog()

const changeFileId = ref("")

const changeFileTitle = ref("")


const miniListClick = (value: DataListMiniItem, index: number, pValue: DataListItem, pIndex: number) => {
    const fileId = pValue.key
    const title = pValue.title
    const model = value.key
    if (fileId && model) {
        changeFileId.value = fileId
        changeFileTitle.value = title

        switch (model) {
            case "editor":
                changFileNameDalog.open()
                break
            case "share":
                copyText(`${location.origin}/#/home?id=${changeFileId.value}`).then(() => {
                    ElMessage.info("链接已复制到剪切板,访问链接即可直接进入对应文档")
                }).catch((err) => {
                    ElMessage.info("复制未成功,理由是: " + JSON.stringify(err))
                })
                break
            case "delete":
                delFileDalog.open()
                break

        }
    }
    emit("miniClick", value, index, pValue, pIndex)
}

const createDalog = useDialog()

const onAdd = () => createDalog.open()


</script>

<template>
    <div class="file_list_main" :style="{
        height: height || '100%'
    }">
        <div class="title">
            文件列表
        </div>
        <div class="list">
            <IconList :icon="false" @list-click="listClick" @add="onAdd" @mini-click="miniListClick" :data="iconData"
                :mini-data="miniData" :cIndex="clickIndex" show-add />
        </div>
    </div>
    <ChangeFileNameDalog :use="changFileNameDalog" :file-id="changeFileId" />
    <DelFile :file-id="changeFileId" :use="delFileDalog" :title="changeFileTitle" />
    <Create :use="createDalog" />
</template>

<style lang="scss" scoped>
.file_list_main {
    display: flex;
    flex-direction: column;

    & * {
        user-select: none;
    }

    .title {
        font-size: 20px;
        color: var(--File_List_Tital);
        padding: 0 5px;
        font-weight: 700;
        margin-bottom: 6px;
    }

    .list {
        flex: 1;
        min-height: 0;
    }

    .none {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--List_None_File);
    }
}
</style>