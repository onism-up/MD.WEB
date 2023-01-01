# 🎆 MD.WEB

基于 vue3 环境的 私有 Markdown 笔记应用（前台部分），使用 `typescript` 语法开发，工具和组件都有相应封装，感兴趣的同学可以继续拓展。

- 在线预览：[传送门](https://imzbf.github.io/md-editor-v3)

- 同系列后端：[传送门](https://github.com/imzbf/md-editor-rt)

## ⭐️ 功能一览

- 快速搭建私人服务器部署的笔记应用，也可以当其为轻型博客；
- 内置的白色主题和暗黑主题，支持动态切换；
- 支持快速在线对程序中的文档进行增删改查；
- 轻松和快速的分享你的创意；
- 完善的 MD 语法支持；
- 无需数据库支持，本应用目前应是无依赖数据库版本；
- 较强的可移植性和稳定性，可批量导入文档；

## 📦 安装

```shell
yarn add md-editor-v3
```

如果你需要配置`renderer`并且你的项目使用了 typescript，需要将`@types/marked`安装到你的开发依赖中：

```shell
yarn add @types/marked -D
```

使用语言、预览主题扩展库：

```shell
yarn add @vavt/md-editor-extension
```

更多使用及贡献方式参考：[md-editor-extension](https://github.com/imzbf/md-editor-extension)

## 💡 用法

```vue
<template>
  <md-editor v-model="text" preview-only />
</template>

<script setup>
import { ref } from "vue";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const text = ref("# Hello Editor");
</script>
```

## 🗺 预览图

| 默认模式                                                         | 暗黑模式                                                        | 仅预览                                                                 |
| ---------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ![](https://imzbf.github.io/md-editor-v3/imgs/preview-light.png) | ![](https://imzbf.github.io/md-editor-v3/imgs/preview-dark.png) | ![](https://imzbf.github.io/md-editor-v3/imgs/preview-previewOnly.png) |

简单的标记和表情扩展预览

![mark and emoji extension](https://imzbf.github.io/md-editor-v3/imgs/mark_emoji.gif)
