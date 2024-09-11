---
description: vite 项目开启 gzip
date: 2023-08-07
tag:
  - 前端
tags:
  - Vue
---

# vite 项目开启 gzip

今天研究了一下 vite 项目开启 gzip 打包，配合 nginx 踩了一点小坑。特此记录一下

### 1. vue 项目安装插件

```powershell
pnpm add vite-plugin-compression -D
```

```js
// vite.config.ts
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    // ....其他配置
    viteCompression({
      algorithm: "gzip",
      deleteOriginFile: false, // 不删除源文件
    }),
  ],
});
```

### 2. 配置 nginx

配置静态压缩需要 nginx 的`ngx_http_gzip_static_module`模块,我用的 1.25.1 版本，已经默认安装了该模块。配置前可以先执行 `nginx -V`命令看下有没有`--with-http_gzip_static_module`模块。

```nginx
# nginx.conf 文件

http{

    #......其他配置

    # server模块化
    include       xxx/*.conf;  # nginx.conf同级目录新建文件夹xxx

    # 开启gzip
    gzip on;

    # 静态压缩
    gzip_static on;

    # 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
    gzip_min_length 1k;

    # gzip 压缩级别，1-10，数字越大压缩的越好，也越占用CPU时间
    gzip_comp_level 2;

    # 进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png image/jpg;

    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;

    # 禁用IE 6 gzip
    gzip_disable "MSIE [1-6]\.";

    server{
        ...
    }
    #......其他配置

}
```

```nginx
# xxx文件夹下的 xxxx.conf 文件,名字无所谓,只要后缀是 .conf 就行


server {
    listen          8001;
    server_name     localhost;
    location / {
        root    html/zr-workflow/dist;
        index   index.html;
    }
    location /prod-api/{
        proxy_pass http://192.168.1.164:8667/process-task/;
    }

}
```

### 3. 结果

未开启 gzip

[image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d98af4a130a041d0af377e092e809fec~tplv-k3u1fbpfcp-watermark.image?)

开启了 gzip

[image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/455e12b0e4aa445c94c1c4f3d5efdb43~tplv-k3u1fbpfcp-watermark.image?)

**冷知识:**

1. 看看`Response Headers` 下有没有`Content-Encoding: gzip`,有就代表开启了 gzip

2. 看看`Etag`选项 有没有 `W/` 。有：服务器端压缩,`gzip_static`失效，没有：服务端直接拿的.gz 文件
