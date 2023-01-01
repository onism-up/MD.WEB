
<script lang="ts" setup>
import cache from '@/cache';
import { reactive, ref, onUnmounted, onMounted, watch } from 'vue';
import { throttle } from 'lodash'
import IconList, { DataList, DataListItem } from "@/components/IconList/index.vue"
import FileList from "@/components/FileList/index.vue"
import Search, { SearchResultItem } from "@/components/Search/index.vue"
import Setting from "@/components/SettingMD/index.vue"
import Upload from "@/components/Upload/index.vue"
import { useStore } from 'vuex';
import { useDialog } from "@/tools/elm"

const store = useStore()


onMounted(() => {
    store.dispatch("setLogin")
})

onUnmounted(() => { //结束时删除全局函数防止内存泄漏
    document.removeEventListener("mouseup", regulatorUp)
    document.removeEventListener("mousemove", changWidthThrottle)
})

const data = reactive({
    width: cache.getItem("sidebarWidth")
})

let canChangeWidth = false
const opacity = ref("0")
const changWidth = (event: MouseEvent) => {

    if (canChangeWidth) {
        opacity.value = "1"
        data.width = event.clientX
        document.body.style.cursor = "col-resize"
    } else {
        document.body.style.cursor = ""
        opacity.value = "0"
    }
}

const regulatorUp = () => {
    opacity.value = "0"
    canChangeWidth = false
    cache.setItem("sidebarWidth", data.width)
}


const changWidthThrottle = throttle(changWidth, 350)



document.addEventListener("mouseup", regulatorUp) //必须监听全局才能流畅调节宽度
document.addEventListener("mousemove", changWidthThrottle)




const topListData: DataList = [
    {
        iconPath: "/search.png",
        title: "搜索",
        key: "search"
    },
    {
        iconPath: "/setting.png",
        title: "设置",
        key: "setting"
    }, {
        iconPath: "/import.png",
        title: "从外部导入",
        login: true,
        key: "import"
    }
]


const searchDialog = useDialog()

const topListClick = (value: DataListItem | null, index: number) => {
    if (!value) return
    const key = value.key
    switch (key) {
        case "search":
            searchDialog.open()
            break
        case "setting":
            settingDialog.open()
            break
        case "import":
            uploadDialog.open()
            break
    }
}

const fileListClick = (value: DataListItem | null) => {
    if (value && value.key && store.state.checkMDId != value.key) {
        store.dispatch("setFileDetail", value.key)
    }
}

const searchClick = async (value: SearchResultItem) => {
    if (store.state.checkMDId == value.id) return searchDialog.close()
    console.log(store.state.checkMDId == value.id)
    try {
        await store.dispatch("setFileDetail", value.id)
        searchDialog.close()
    } catch {
        return false
    }
}

const greetings = ref("你好,写者")

watch(() => store.state.isLogin, (newValue) => {
    if (newValue) greetings.value = "你好,写者"
    else greetings.value = "你好,读者"
}, {
    immediate: true
})


const settingDialog = useDialog()


const uploadDialog = useDialog()

</script>

<template>
    <div class="main" :style="{ width: `${data.width}px` }">
        <div class="greetings">
            {{ greetings }}
        </div>
        <div class="config">
            <IconList :data="topListData" @list-click="topListClick" :icon="true" />
        </div>
        <div class="file_list">
            <FileList @list-click="fileListClick" />
        </div>
        <div class="regulator" @mousedown="(canChangeWidth = true)" @mousemove='opacity = "1"' :style="{
    opacity
}" />
    </div>
    <Search :use="searchDialog" @list-click="searchClick" />
    <Setting :use="settingDialog" />
    <Upload :use="uploadDialog" />
</template>


<style lang="scss" scoped>
.main {
    padding-top: 5px;
    background-color: var(--SiderBarBgc);
    height: 100vh;
    position: relative;
    transition: all 0.5s ease;
    min-width: 200px;
    max-width: 500px;
    display: flex;
    flex-direction: column;

    .regulator {
        height: 100vh;
        right: 0;
        top: 0;
        width: 5px;
        cursor: col-resize;
        position: absolute;
        transition: all 0.2s ease;
        background-color: RGB(222, 222, 220);
        opacity: 0;
    }



    .file_list {
        flex: 1;
        min-height: 0;
    }

    .greetings {
        width: 100%;
        height: 30px;
        font-size: 18px;
        color: var(--Greeting_Color);
        transition: all 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }
}
</style>