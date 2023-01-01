<template>
    <div class="md">
        <div class="md_change" :style="{
            opacity: pageChangeLoading ? 1 : 0,
            zIndex: pageChangeLoading ? 100 : 0
        }">

        </div>
        <div class="md_edit" v-if="fileData && !pageChangeLoading">
            <div class="herder">
                {{ fileData.title }}

            </div>
            <div class="open_edit">
                <el-button type="primary" size="small" :icon="Edit" v-if='isLogin && !eidtMode'
                    @click="eidtMode = true">
                    编辑模式
                </el-button>
                <div v-if="eidtMode">
                    <el-button type="primary" size="small" :icon="EditPen" @click="changFileNameDalog.open()">
                        编辑标题
                    </el-button>
                    <el-button type="primary" size="small" :icon="Back" @click="exitEdit">
                        退出编辑
                    </el-button>
                    <el-button :type="pubStatus ? 'success' : 'danger'" size="small" @click="changePub">
                        {{ pubStatus ? "公开的" : "私有的" }}
                    </el-button>
                    <el-tag type="warning" class="info">{{ infoMsg }}</el-tag>
                </div>

            </div>
            <div class="read" v-if="!eidtMode">
                <md-editor v-model="fileData.body" preview-only :theme="theme" />
            </div>
            <div class="edit" v-else>
                <md-editor v-model="eidtBody" @change="onSave" :theme="theme" />
            </div>
        </div>
        <div class="md_none" v-else-if="!pageChangeLoading">
            MD.Web
        </div>
        <ChangeFileNameDalog :file-id="fileId" :use="changFileNameDalog" />
    </div>

</template>
  
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from "vuex"
import { getSaveDetial, FileDetialType } from "@/ajax/api"
import { Edit, EditPen, Back } from "@element-plus/icons-vue"
import ChangeFileNameDalog from "@/components/ChangeFileName/index.vue"
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { debounce, cloneDeep } from "lodash"
import { useDialog } from "@/tools/elm"

const theme = computed<"light" | "dark">(() => store.state.theme)

const changFileNameDalog = useDialog()

const store = useStore()

const eidtBody = ref('')

const eidtMode = ref(false)

const infoMsg = ref("提示：文档会在无操作一段时间后自动保存")

const pageChangeLoading = ref(false)

const pubStatus = ref(false)

const onPageChange = () => {
    pageChangeLoading.value = true
    setTimeout(() => {
        pageChangeLoading.value = false
    }, 300)
}



watch(() => store.state.fileDetial, (value: FileDetialType | null) => {
    if (value) {
        eidtBody.value = value.body
        pubStatus.value = value.is_public
    }
    eidtMode.value = false
    onPageChange()
}, {
    immediate: true
})

const exitEdit = () => {
    eidtMode.value = false
    store.dispatch("setFileDetail", store.state.checkMDId)
}



const changePub = () => {
    pubStatus.value = !pubStatus.value
    setSave()
}

onMounted(() => {
    if (store.state.checkMDId && !store.state.fileDetial) store.dispatch("setFileDetail", store.state.checkMDId)
})

const fileData = computed<FileDetialType | null>(() => store.state.fileDetial)

const isLogin = computed<boolean>(() => store.state.isLogin)

const onSave = (v: string) => {
    eidtBody.value = v
    setSave()
}


const setSave = debounce(async () => {
    if (fileData) {
        const newValue = cloneDeep(fileData.value as FileDetialType)
        newValue.body = eidtBody.value
        newValue.is_public = pubStatus.value
        infoMsg.value = "保存中..."
        try {
            await getSaveDetial(newValue)
            infoMsg.value = "保存成功"
        } catch {
            infoMsg.value = "保存失败请稍后再试"
        }
    }
}, 300)



const fileId = computed(() => {
    if (fileData.value) {
        return fileData.value.id
    } else {
        return ""
    }
})




</script>

<style lang="scss" scoped>
.md {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: var(--MD_Edit_BGC);

    .md_change {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--Md_Change_BGC);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 100;
    }

    .md_edit {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--MD_Edit_BGC);

        .open_edit {
            position: absolute;
            top: 100px;
            left: 80px;
            z-index: 99;
        }

        .herder {
            font-weight: 600;
            font-size: 30px;
            color: var(--Md_Titel_Color);
            margin-top: 60px;
            margin-bottom: 20px;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
        }

        .herder,
        .read,
        .edit {
            padding: 0 80px;


        }

        .read {
            flex: 1;
        }

        .edit {
            margin-top: 30px;

            .md-editor {
                height: 550px !important;
            }
        }

        .open_edit {

            .info {
                margin-left: 10px;
            }
        }


    }

    .md_none {
        color: var(--Md_Read_None_Color);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        user-select: none;
    }
}
</style>