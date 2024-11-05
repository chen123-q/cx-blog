---
description: 记录 pnpm 修改 node_modules 包代码步骤
date: 2024-09-09
tag:
  - 前端
tags:
  - pnpm
---

# pnpm 修改 node_modules 包代码

## 1. 写作背景

最近用 vitepress 和 @sugarat/them 搭建了一个个人博客的静态网站，想做一个进入首页时提示日期和时间段的问候语。然后就框框撸代码，跑起来看看， 如图 1，嗯？服务端打印，不能动态展示时间段...

![图1](https://pic2.zhimg.com/v2-e579b87453cf6a8efdff01fc7820cb7d_r.jpg)

## 2. 解决方法

#### 1. 直接修改 node_modules 的源代码，但是下次 pnpm i 时修改的代码会被覆盖。 不考虑

#### 2. patch-package

由于我用的 pnpm,所以接下来的操作都是基于 pnpm 安装依赖，如果你是 npm 或 yarn [戳这里](https://juejin.cn/post/7139396270967226398)

[pnpm 文档在这里](https://pnpm.io/zh/8.x/cli/patch)

1. 安装依赖

```bash
pnpm add patch-package

```

2. 克隆包(包名@版本号)

```bash
pnpm patch @sugarat/theme@^0.4.10
```

3. 修改克隆的包代码后执行命令生成补丁文件

```bash
pnpm patch-commit 'C:\Users\ADMINI~1\AppData\Local\Temp\0313db06f9196f773366645dc82ff260'
```

然后会在项目根目录生成 `patches/@sugarat__theme@0.4.10.patch`文件同时在 `package.json` 中新增了配置项 如图 2

![图2](https://pica.zhimg.com/v2-33f25f573520e8d4c4e823d3192e9dc4_r.jpg)
然后重新启动项目，至此大功告成

![图3](https://pic1.zhimg.com/v2-c2b6bcb864701aa95b6dad4c4305a2d6_r.jpg)
