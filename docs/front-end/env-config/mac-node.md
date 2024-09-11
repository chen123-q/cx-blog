---
title: mac 安装 nvm
description: mac 配置 nodejs 环境
date: 2023-07-29
tag:
  - 前端
tags:
  - JavaScript
---

### mac 安装 nvm

先卸载原来的 node（未尝试）

```bash
sudo rm -rf /usr/local/{bin/{node,npm},lib/node_modules/npm,lib/node,share/man/*/node.*}
```

由于我是新电脑所以直接安装 nvm

1.  下载

```shell
git clone https://gitee.com/mirrors/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```

2.  配置变量

```bash
# 进入根目录
cd ~

# 进入文件夹
vim ~/.zshrc

# 输入 i 进入编辑模式复制粘贴下面三行，编辑完输入命令 :wq进行退出
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

# 刷新变量文件
 source ~/.zshrc
```

3.  检查一下\
    nvm -v

4.  安装 node ...

5.  附图

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ca1cb2873bb4ae5813874d523bd9b3e~tplv-k3u1fbpfcp-watermark.image#?w=1180&h=764&s=258678&e=png&b=1f1f1f)

:point_right:[查看图片](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ca1cb2873bb4ae5813874d523bd9b3e~tplv-k3u1fbpfcp-watermark.image#?w=1180&h=764&s=258678&e=png&b=1f1f1f)

#### 参考：

[Mac 安装 nvm 及 cnpm 的坑点 (包括 M1, M2 安装 nvm) - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/552636287)

[mac 安装 nvm 详细教程 ｜｜ mac 配置 nvm 避坑 - 掘金 (juejin.cn)](https://juejin.cn/post/7232499180660768829)

[vim 极为详细的教程（一）基本操作 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/149515175)

### 设置 nodejs 源

:::warning
这个办法需开梯子
:::

今天是 2024.8.3，想通过 nvm 升级 nodejs 到 v20 版本，终端运行`nvm ls-remote` 后只显示 iojs 版本的 nodejs，百度上看了一堆帖子。 有效操作如下：

```bash
# 编辑 .zshrc 文件
vim ~/.zshrc

# 添加这一行
export NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist

# 按 esc 键然后输入 :wq 保存并退出

# 刷新变量文件
 source ~/.zshrc
```
