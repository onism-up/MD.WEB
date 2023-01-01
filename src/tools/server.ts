import { Result } from "@/ajax/request";
import { ElMessage } from "element-plus";

export const serverErrorParsing = (res: Result): boolean => {
  const [errorCode, errorMsg] = res.message.split(":");
  const errorType = getErrorType(Number(errorCode) - 1);
  if (!res.status) {
    ElMessage.info(errorType);

    switch (Number(errorType)) {
      case 0:
      case 1:
      case 2:
        location.replace(location.origin);
        break;
    }
  }
  return res.status;
};

export const getUrl = (url: string): string => {
  const baseUrl = "http://127.0.0.1:8171/api";

  return baseUrl + url;
};

export const parseStringTime = (data: string): Date => {
  const arrData = data.split(" ");
  return new Date(arrData.length < 2 ? "" : arrData[0] + " " + arrData[1]);
};

export const getErrorType = (code: number) => {
  const errData = [
    "用户凭证认证错误",
    "用户认证已重置或用户账号已重置",
    "用户认证解析错误",
    "请求API缺少Body",
    "请求API的Body解析错误",
    "请求API的Body字段不合法",
    "数据初始化错误",
    "账号或密码错误",
    "文件创建出现错误",
    "请求APIQuery字段不合法",
    "历史记录中的文件已删除或请求文件不存在",
    "文件保存失败",
    "文件删除失败",
    "导入中出现错误",
  ];
  return errData[code] ? errData[code] : "未知错误";
};

export const getErrorPubAPI = (url: string): boolean => {
  const api = url
    .replace("http://127.0.0.1:8171/api", "")
    .split("?")[0]
    .replace("/", "");
  const pubApiSet = new Set([
    "file_list",
    "pub_file",
    "file_list",
    "file",
    "modify_user",
    "login",
    "register",
  ]);

  return pubApiSet.has(api);
};
