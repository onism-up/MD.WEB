<script lang="ts" setup>
import useFocus from '@/hook/useFocus';
export type MiniDataListItem = { iconPath: string, key?: string, login?: boolean }
export type DataListMin = MiniDataListItem[]
export type MiniClick = (event: "miniClick", miniValue: MiniDataListItem, miniIndex: number, value: DataListItem, index: number) => void

import { DataListItem } from "@/components/IconList/index.vue"
import { parsingIndex } from "@/tools/elm"
import { useStore } from 'vuex';
import { computed } from 'vue';

const props = defineProps<{
    data: DataListMin,
    index: number,
    parentData: DataListItem
}>()

const { onDown, onDownEvent, onLeaveEvent, onMove, onMoveEvent, onUpEvent } = useFocus("mindex")


const emit = defineEmits<{ (event: "miniClick", miniValue: MiniDataListItem, miniIndex: number, value: DataListItem, index: number): void }>()

const onListClick = (event: MouseEvent) => {
    const index = parsingIndex(event, "mindex")

    emit("miniClick", props.data[index], index, props.parentData, props.index)

    event.stopPropagation()
}

const store = useStore()

const isLogin = computed(() => store.state.isLogin)


</script>

<template>

    <div class="mini_icon" :data-index="index" v-if="data && (data.length > 0)" @mousemove="onMoveEvent"
        @mouseleave="onLeaveEvent" @mouseup="onUpEvent" @mousedown="onDownEvent" @click="onListClick">
        <div class="mini_item" :data-index="index" v-for="item, sonIndex in data" v-show="item.login ? isLogin : true"
            :data-mindex="sonIndex" :key="sonIndex" :class="{
                move: onMove == sonIndex,
                down: onDown == sonIndex
            }">
            <img :src="item.iconPath" :data-index="index" :data-mindex="sonIndex" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.mini_icon {
    display: flex;
    align-items: center;
    justify-content: right;

    .mini_item {
        float: right;
        margin-right: 5px;
        width: 20px;
        height: 20px;
        border-radius: 3px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;

        }
    }

    .move {
        background-color: rgb(200, 200, 200);
    }

    .down {
        background-color: rgb(190, 190, 190) !important;
    }
}
</style>