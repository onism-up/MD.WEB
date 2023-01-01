import type { RouteRecordRaw } from "vue-router";

type Routers = Readonly<RouteRecordRaw[]>;

export const routes: Routers = [
  {
    path: "/home",
    component: () => import("@/pages/Home/index.vue"),
  },
  {
    path: "/connect",
    component: () => import("@/pages/ConnectServer/index.vue"),
    meta: {
      title: "连接服务器",
    },
  },
  {
    path: "/init",
    component: () => import("@/pages/Init/index.vue"),
    meta: {
      title: "配置写者",
    },
  },
  {
    path: "/",
    redirect: "/connect",
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/connect",
  },
];
