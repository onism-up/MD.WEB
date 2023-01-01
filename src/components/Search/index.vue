<template>
    <el-dialog v-model="dialogVisible" :title="title" :show-close="false" center>
        <div @input="debounceSetSearch">
            <el-input v-model="input" placeholder="键入关键字" />
        </div>
        <div class="search_result" @mousemove="onMoveEvent" @mouseleave="onLeaveEvent" @mousedown="onDownEvent"
            @mouseup="onUpEvent">
            <div class="item" @click="emit('listClick', item, index)" v-for="item, index in searchData" :key="item.id"
                :data-sindex="index">
                <LightParsing :data="item" :bright="onMove == index" :p-index="index" :click="onDown == index" />
            </div>
            <div class="none" v-if="!searchData.length && loading">
                无数据
            </div>
        </div>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { DialogControl } from "@/tools/elm"
import { getSearch } from "@/ajax/api"
import { debounce } from 'lodash'
import LightParsing from '@/components/LightParsing/index.vue'
import useFocus from "@/hook/useFocus"

export type SearchResultType = SearchResultItem[]


export type SearchResultItem = {
    title: SearchItem,
    body: SearchItem,
    id: string,
    create_time: string,
    last_chang_time: string
}


export type SearchItem = {
    data: string[] | null,
    highlight_index: number[] | null
}

const emit = defineEmits<{
    (event: "listClick", value: SearchResultItem, index: number): Promise<boolean>
}>()


const searchData = ref<SearchResultType>([])

const input = ref('')

const title = ref("搜索")

const loading = ref(false)

const props = defineProps<{
    use?: DialogControl,
}>()



const { onDown, onDownEvent, onLeaveEvent, onMove, onMoveEvent, onUpEvent } = useFocus("sindex")


const setSearch = async () => {
    if (input.value.length) {
        title.value = "加载中..."
        try {
            const res = await getSearch(input.value) as unknown as SearchResultType
            title.value = `"${input.value}”的搜索结果`
            searchData.value = res
        } catch {
            title.value = "出错了,稍后再尝试进行搜索"
            searchData.value = []
        }
        loading.value = true
    } else {
        title.value = "搜索"
        searchData.value = []
        loading.value = false
    }
}

const debounceSetSearch = debounce(setSearch, 300)

if (props.use) {
    props.use.close = () => dialogVisible.value = false
    props.use.open = () => {
        dialogVisible.value = true
    }
}

const dialogVisible = ref(false)

watch(dialogVisible, (value) => {
    if (!value) {
        input.value = ""
        title.value = "搜索"
        searchData.value = []
        loading.value = false

    }
})



</script>

<style scoped lang="scss">
.search_result {
    max-height: 550px;
    width: 100%;
    overflow: hidden;

    .none {
        width: 100%;
        height: 60px;
        text-align: center;
        line-height: 60px;
        color: var(--Search_Result_None);
    }

    .item {
        padding: 5px 0;

    }
}
</style>