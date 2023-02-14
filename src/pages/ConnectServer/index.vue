<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElLoading, ElMessage } from 'element-plus'
import { getServerStatus, getUserInit } from "@/ajax/api"
import { useRouter } from 'vue-router';
import cache from '@/cache';


onMounted(() => {
    connectServer()
})

const router = useRouter()
18
const loading = ElLoading.service({
    lock: true,
    text: '正在测试本地与服务器的连接'
})

const errorMeg = ref("")

const init = ref(false)

const connectServer = async () => {
    try {
        await getServerStatus()
        try {
            await getUserInit()
            const isFirst = cache.getItem("first")
            if (isFirst) {
                ElMessage.info("欢迎来到MD.WEB")
                cache.setItem("first", false)
            }
            try {
                router.push("/home")
            } catch (e) {
                console.log(e)
            }
        } catch (error) {
            ElMessage.info("成功与服务器建立通讯,但写者数据未初始化或被重置,即将进入初始化界面")
            init.value = true
            setTimeout(() => router.push("/init"), 2500)
        }
    } catch (error) {
        errorMeg.value = JSON.stringify(error)
    }
    loading.close()
}

</script>




<template>
    <div class="err_con" v-if="errorMeg">
        <h1>与服务器连接失败,以下是错误信息,请携带以下信息联系有关人员</h1>
        <div class="msg">
            {{ errorMeg }}
        </div>
    </div>
    <div class="go_init" v-if="init">
        <h1>即将进入初始化界面.....</h1>
    </div>
</template>


<style lang="scss" scoped>
.err_con {
    h1 {
        color: var(--Sys_Font_Color);
        user-select: none;
    }

    .msg {
        width: 90%;
        min-height: 20vh;
    }
}

.go_init {
    width: 100vw;
    height: 100vh;
    color: var(--Sys_Font_Color);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>