<script  lang='ts' setup>
import { SearchItem } from "@/components/Search/index.vue"
import { StyleValue } from "vue"
import { XSSParsing } from "@/tools/elm"
const props = defineProps<{
    data: SearchItem,
    fontStyle?: StyleValue, //修改关键信息会导致全局主题色应用失效
    title?: string,
    pIndex?: number
}>()


const itemAnalysis = (body: string, index: number): string => {
    const data = props.data.data!
    const lenData = data.length
    if (lenData > 1 && index === 0 && body.length > 10) { //第一段如果太长就剪切
        return body.slice(body.length - 10, body.length)
    }
    return body
}
</script>

<template>
    <div class="hightline_main" :data-sindex="pIndex">
        {{ title ? `${title}- -` : "" }}
        <p v-for="item, index in data.data" :key="index" :data-sindex="pIndex" :style="fontStyle" :class="{
            select: data.highlight_index && data.highlight_index.includes(index)
        }">
            {{ XSSParsing(itemAnalysis(item, index)) }}
        </p>
        <p :data-sindex="pIndex">{{ !data.data?.length ? "-" : '' }} </p>
    </div>

</template>

<style lang="scss" scoped>
.hightline_main {
    width: 100%;
    height: 100%;
    display: flex;
    color: var(--Search_Info_Color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    align-items: center;

    .select {
        color: var(--Search_Select_Color)
    }
}
</style>