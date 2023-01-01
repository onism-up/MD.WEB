<template>
    <el-dialog v-model="dialogVisible" :show-close="false" center title="设置" width="400px">
        <div class="setting">
            <SettingConfig />
        </div>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { DialogControl } from "@/tools/elm"
import SettingConfig from "@/components/SettingConfig/index.vue"

const loading = ref(false)

const props = defineProps<{
    use?: DialogControl,
}>()

const dialogVisible = ref(false)

watch(dialogVisible, () => {
    loading.value = false
})

if (props.use) {
    props.use.close = () => dialogVisible.value = false
    props.use.open = () => dialogVisible.value = true

}

</script>
<style scoped lang="scss">
.setting {
    width: 100%;
    display: flex;
    padding: 0px 50px;
}
</style>