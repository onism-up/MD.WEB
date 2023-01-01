import { createApp } from "vue";

import { router } from "./routers/router";

import "element-plus/theme-chalk/index.css";

import "@/them.css";

import stroe from "./stroe";

import App from "./App.vue";

const app = createApp(App);

app.use(stroe);

app.use(router);

app.mount("#app");
