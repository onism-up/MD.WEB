<script setup lang='ts'>
import { SearchResultItem } from "@/components/Search/index.vue"
import HightLine from "@/components/HightLine/index.vue"
defineProps<{
    data: SearchResultItem,
    bright?: boolean,
    click?: boolean
    pIndex?: number
}>()

</script>

<template>
    <div class="light_parsing" :data-sindex="pIndex" :class="{
        light_parsing_bright: bright,
        click
    }">
        <div class="title" :data-sindex="pIndex">
            <HightLine :data="data.title" :p-index="pIndex" :font-style="{
                'fontSize': '20px'
            }"></HightLine>
        </div>
        <div class="body" :data-sindex="pIndex">
            <HightLine :data="data.body" :p-index="pIndex" :font-style="{
                'fontSize': '13px'
            }"></HightLine>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.light_parsing {
    border-radius: 6px;

    .title {
        width: 100%;

    }

    .body {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        align-items: center;
    }

    width: 100%;

    border-bottom: 1px solid var(--Search_Result_Border_Color);

    padding: 0 5px;
    user-select: none;
    cursor: pointer;

}

.light_parsing_bright {
    background-color: var(--Search_Result_Bright_BGColor);
}

.click {
    background-color: var(--Search_Result_Click_BGColor);
}
</style>