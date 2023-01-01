import { createWebHashHistory, createRouter } from "vue-router";
import { routes } from "./origin";
import { getUserInit } from "@/ajax/api";
import { ElMessage } from "element-plus";
import cache from "@/cache";
const history = createWebHashHistory();

export const router = createRouter({
  history,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (
    to.path.includes("/home") &&
    from.path != "/init" &&
    from.path != "/connect"
  ) {
    if (typeof to.query.id == "string" && to.query.id) {
      cache.setItem("checkMDId", to.query.id);
    }
    location.replace(location.origin);
  } else if (to.path === "/init") {
    try {
      await getUserInit();
      ElMessage.info("写者数据已配置非法进入");
      next("/home");
    } catch {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  const defultTitl = "MD.Web";
  if (to.meta.title && typeof to.meta.title === "string") {
    document.title = `${to.meta.title}||${defultTitl}`;
  } else {
    document.title = defultTitl;
  }
});
