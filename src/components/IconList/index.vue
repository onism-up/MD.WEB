<script lang="ts" setup>
import { computed } from "vue"
import { parsingIndex, XSSParsing } from "@/tools/elm"
import MiniList, { DataListMin, MiniDataListItem } from "@/components/MiniList/index.vue"
import useFocus from "@/hook/useFocus"
import { useStore } from "vuex"
export type MiniList = DataListMin

export type DataListMiniItem = MiniDataListItem

export type DataListItem = { iconPath?: string, key?: string, title: string, login?: boolean, miniMenu?: boolean }

export type DataList = DataListItem[]

export type IconListEvent = {
    (event: "listClick", value: DataListItem, index: number): void,
    (event: "miniClick", miniValue: MiniDataListItem, miniIndex: number, value: DataListItem, index: number): void
    (event: "add"): void
}

const emit = defineEmits<IconListEvent>()

const props = defineProps<{
    data: DataList
    icon: boolean
    miniData?: MiniList
    cIndex?: number
    showAdd?: boolean
}>()

const { onDown, onDownEvent, onLeaveEvent, onMove, onMoveEvent, onUpEvent } = useFocus("index")

const listData = computed(() => {
    const result = [...props.data]
    if (props.showAdd) {
        result.push({
            iconPath: "/add.png",
            title: "添加",
            login: true,
            key: "$add",
            miniMenu: false
        })
    }
    return result
})


const onListClick = (event: MouseEvent) => {
    const index = parsingIndex(event, "index")

    emit("listClick", props.data[index], index)
}

const onMiniClick = (miniValue: MiniDataListItem, miniIndex: number, value: DataListItem, index: number) => {
    emit("miniClick", miniValue, miniIndex, value, index)
}


const store = useStore()

const isLogin = computed(() => store.state.isLogin)

</script>

<template>
    <div class="iconlist_main" @mousemove="onMoveEvent" @click="onListClick" @mouseleave="onLeaveEvent"
        @mouseup="onUpEvent" @mousedown.stop="onDownEvent">
        <div class="list" v-for="(value, index) in listData" :key="value.key || index"
            v-show="value.login ? isLogin : true" :data-index="index" :class="{
                selected: onMove == index,
                click: onDown == index,
                fileCheck: index === cIndex
            }" @click="value.key === '$add' && emit('add')">
            <div class="icon" :data-index="index" v-if="value.iconPath">
                <img :src="value.iconPath" :alt="value.title" :data-index="index">
            </div>
            <div class="title" :data-index="index">{{ XSSParsing(value.title) }}</div>
            <div class="mini" :data-index="index"
                v-show="(miniData && (miniData.length > 0) && onMove == index && value.miniMenu)">
                <MiniList :data="miniData" :index="index" @mini-click="onMiniClick" v-if="miniData"
                    :parent-data="value" />
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.iconlist_main {
    width: 100%;
    padding: 0 8px;
    height: 100%;
    overflow: auto;

    & * {
        user-select: none
    }

    $height: 30px;

    .list {
        width: 100%;
        height: $height;
        display: flex;
        cursor: pointer;
        border-radius: 5px;
        position: relative;
        margin: 2px 0;

        .icon {
            width: $height;
            height: $height;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 55%;
                height: 55%;
            }
        }

        .title {
            font-size: 15px;
            height: 100%;
            line-height: $height;
            width: 75%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--Sys_Font_Color);
            padding: 0 5px;
        }

        .mini {
            height: 100%;
            right: 0;
            position: absolute;
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: right;
        }
    }

    .selected {
        background-color: rgb(223, 223, 221);

        .title {
            color: rgb(135, 135, 135) !important;

        }

    }

    .click {
        background-color: rgb(216, 216, 214);
    }

    .fileCheck {
        background-color: rgb(216, 216, 214);

        .title {
            color: rgb(104, 104, 104) !important;

        }
    }
}
</style>