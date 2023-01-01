<template>
    <div class="user_init">
        <el-form ref="ruleFormRef" label-position="top" :model="ruleForm" :rules="rules" label-width="120px"
            class="demo-ruleForm" :size="formSize" status-icon>
            <el-form-item label="用户名" prop="name">
                <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
                <el-input v-model="ruleForm.pwd" type="password" />
            </el-form-item>

            <el-form-item>
                <div class="sumbit">
                    <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref, } from 'vue'
import { FormInstance, FormRules, ElLoading, ElMessage } from 'element-plus'
import { getRegister } from "@/ajax/api"
import cache from '@/cache';
import { useRouter } from 'vue-router';


const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    name: '',
    pwd: ""
})

const props = defineProps<{
    jump?: boolean
}>()

const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请填写用户名称', trigger: 'blur' },
        { min: 3, max: 10, message: '用户名长度在3~10之内', trigger: 'blur' },
    ],
    pwd: [
        { required: true, message: '请填写密码', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度在6~18之内', trigger: 'blur' },
    ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        await formEl.validate()
        setUsetInfo()
    } catch {

    }

}

const router = useRouter()

const setUsetInfo = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: '等待服务器确认'
    })
    const { name, pwd } = ruleForm
    try {
        const token = await getRegister(name, pwd)
        cache.setItem('token', token as unknown as string)
        ElMessage.info("配置完成")
        props.jump && router.push("/home")
    } catch { }
    loading.close()
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}


</script>

<style lang="scss" scoped>
.user_init {
    .sumbit {
        width: 100%;
        display: flex;
        justify-content: center;

    }

}
</style>