---
description: flv视频播放折腾了好久最终实现。 简单记录下
date: 2023-06-29
tag:
  - 前端
tags:
  - Vue
---

# flv 视频播放

flv 视频播放折腾了好久最终实现。 简单记录下

## 总结

- 视频文件格式与视频封装格式是两码事
- 谷歌浏览器不可以自动播放，需人为点击

### pnpm 安装 flv.js

```js
pnpm add flv.js
```

### 代码

```vue
<script setup lang="ts">
import { onMounted, reactive, onUnmounted } from "vue";
import flvjs from "flv.js";

interface ObjectKey {
  [k: string]: any;
}

const state = reactive<ObjectKey>({
  flvPlayer: {},
});

onMounted(() => {
  if (flvjs.isSupported()) {
    // 获取DOM对象
    const player = document.getElementById("videoElement");
    // 创建flvjs对象
    state.flvPlayer = flvjs.createPlayer({
      type: "flv", // 指定视频类型
      // isLive: false, // 开启直播
      // hasAudio: false, // 关闭声音
      // cors: true, // 开启跨域访问
      url: "http://192.168.1.165:8080/live/12/2023-06-28/2.flv", // 指定流链接
    });
    // 将flvjs对象和DOM对象绑定
    state.flvPlayer.attachMediaElement(player);
  }
});

// 播放视频
function play() {
  state.flvPlayer.load(); // 加载视频
  state.flvPlayer.play(); // 播放
}

//页面退出销毁和暂停播放
onUnmounted(() => {
  state.flvPlayer.pause();
  state.flvPlayer.unload();
  // 卸载DOM对象
  state.flvPlayer.detachMediaElement();
  // 销毁flvjs对象
  state.flvPlayer.destroy();
});
</script>

<template>
  <div id="VideoTest">
    <video controls autoplay muted id="videoElement">
      <source type="video/mp4" />
    </video>
    <button @click="play">播放</button>
  </div>
</template>

<style scoped>
#VideoTest {
  width: 50%;
  height: 50%;
}
video {
  width: 100%;
  height: 100%;
}
</style>
```

本文改自于 [前端播放 flv 格式视频 - 简书](https://www.jianshu.com/p/74add10ceff8)

###### 相关参考

视频格式：[视频格式那么多，MP4/RMVB/MKV/AVI 等，这些视频格式与编码压缩标准 mpeg4，H.264.H.265 等有什么关系？ - 知乎](https://www.zhihu.com/question/20997688)
