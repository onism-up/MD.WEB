<template>
    <div class="setting_config">
        <el-form ref="ruleFormRef" label-position="top" :inline="true" :model="ruleForm">
            <el-form-item label="写者身份" prop="login">
                <el-switch v-model="ruleForm.login" @change="onChangeLogin" />
            </el-form-item>
            <el-form-item label="暗黑模式" prop="dark">
                <el-switch :model-value="theme" @change="onChangeTheme" />
            </el-form-item>
        </el-form>
    </div>
    <Login :use="settingConfigDialog" />
    <ExitLogin :use="exitLoginDialog" />

</template>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import Login from "@/components/Login/index.vue"
import ExitLogin from "@/components/ExitLogin/index.vue"
import { useDialog } from "@/tools/elm"
import { useStore } from 'vuex'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    login: false,

})


const store = useStore()

watch(() => store.state.isLogin, (value) => {
    ruleForm.login = value
}, {
    immediate: true
})



const theme = computed(() => store.state.theme === "dark")

const settingConfigDialog = useDialog()

const exitLoginDialog = useDialog()

settingConfigDialog.onValidation((res) => {
    ruleForm.login = res
})

exitLoginDialog.onValidation(res => {
    ruleForm.login = res
})

const onChangeLogin = () => {
    if (ruleForm.login) {
        settingConfigDialog.open()
    } else {
        exitLoginDialog.open()
    }
}

const onChangeTheme = () => {
    if (theme.value) {
        store.commit("changeTheme", "light")
    } else {
        store.commit("changeTheme", "dark")
    }
}


</script>

<style lang="scss" scoped>
.setting_config {
    width: 100%;
    height: 100%;
}
</style>