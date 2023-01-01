import { req } from "./request";

export const test = () => req.get("/test");

export const errorTest = () => req.get("/tst");

export const isLogin = () => req.get("/validation");

export const certificationAPI = async (
  firstApi: string,
  lastApi: string,
  method: string = "get",
  data?: any
): Promise<any> => {
  let api = firstApi;
  try {
    await isLogin();
  } catch {
    api = lastApi;
  }
  return req.request({
    method,
    data,
    url: api,
  });
};

export const getFileList = async () =>
  certificationAPI("/file_list", "/pub_file_list");

export const getServerStatus = () => req.get("/test");

export const getUserInit = () => req.get("/user_init");

export const getRegister = (name: string, pwd: string) =>
  req.post("/register", {
    name,
    pwd,
  });

export const getFileDetial = async (id: string) =>
  certificationAPI(`/file?id=${id}`, `/pub_file?id=${id}`);

export type FileDetialType = {
  body: string;
  create_time: string;
  id: string;
  is_public: boolean;
  lastChangTime: string;
  title: string;
};

export const getSaveDetial = (file: FileDetialType) => req.patch("/file", file);

export const getDelFile = (id: string) => req.delete(`/file?id=${id}`);

export const getSearch = (key: string) =>
  certificationAPI(`/search?key=${key}`, `/pub_search?key=${key}`);

export const getLogin = (name: string, pwd: string) =>
  req.post("/login", { name, pwd });

export const getCreateFile = (title: string) =>
  req.post("/file", {
    title,
  });
