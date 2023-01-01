import cache from "@/cache";
import { createStore } from "vuex";
import {
  isLogin,
  getFileList,
  getFileDetial,
  FileDetialType,
} from "@/ajax/api";
import { parseStringTime } from "@/tools/server";

export type FileListItemType = {
  id: string;
  title: string;
  creat_time: string;
};

export type FileListType = Array<FileListItemType>;

export default createStore<{
  checkMDId: string;
  isLogin: boolean;
  fileList: FileListType;
  fileDetial: FileDetialType | null;
  theme: string;
}>({
  actions: {
    async setLogin({ commit }) {
      try {
        await isLogin();
        commit("changeLogin", true);
      } catch {
        commit("changeLogin", false);
      }
    },
    async setFileList({ commit }) {
      try {
        commit("changeFileList", await getFileList());
      } catch {}
    },
    async setFileDetail({ commit }, id) {
      try {
        const detial = await getFileDetial(id);
        commit("changeCheckMDId", id);
        commit("changFileDetial", detial);
      } catch {
        commit("changeCheckMDId", "");
        return Promise.reject("");
      }
    },
  },
  mutations: {
    changeCheckMDId(state, value) {
      cache.setItem("checkMDId", value);
      state.checkMDId = value;
    },
    changeLogin(state, value) {
      state.isLogin = value;
    },
    changeFileList(state, value) {
      state.fileList = (value as unknown as FileListType).sort(
        (a, b) =>
          parseStringTime(a.creat_time).getTime() -
          parseStringTime(b.creat_time).getTime()
      );
    },
    changFileDetial(state, value) {
      state.fileDetial = value;
    },
    changeTheme(state, value) {
      cache.setItem("theme", value);
      state.theme = value;
    },
  },
  state: {
    checkMDId: cache.getItem("checkMDId"),
    isLogin: false,
    fileList: [],
    fileDetial: null,
    theme: cache.getItem("theme"),
  },
  getters: {},
});
