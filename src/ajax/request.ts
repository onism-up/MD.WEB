import cache from "@/cache";
import { serverErrorParsing, getErrorPubAPI } from "@/tools/server";
import axios from "axios";
import { ServerPath } from "@/const";
import { ElMessage } from "element-plus";

export const req = axios.create({
  baseURL: ServerPath,
});

export type Result = {
  data: string;
  message: string;
  status: boolean;
};

req.interceptors.request.use((value) => {
  const token = cache.getItem("token");
  if (value.headers) {
    value.headers["token"] = token;
  } else {
    value.headers = { token };
  }
  return value;
});

req.interceptors.response.use(
  (value) => {
    const resData = value.data as Result;
    if (resData.status) {
      value.data = resData.data;
      return value.data;
    } else {
      getErrorPubAPI(value.config.url as string) && serverErrorParsing(resData);
      return Promise.reject(resData.message);
    }
  },
  (error) => {
    if (typeof error === "object" && error.response) {
      const resData = error.response.data as Result;
      if (error.request && error.request.responseURL) {
        getErrorPubAPI(error.request.responseURL as string) &&
          serverErrorParsing(resData);
      }
    } else {
      ElMessage.info("未知错误: " + JSON.stringify(error));
    }

    return Promise.reject(error);
  }
);
