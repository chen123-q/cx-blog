---
description: Vue3项目前端实现打印纸张自定义大小（简单实现）
date: 2023-05-15
# 标签
tag:
  - 前端
tags:
  - Vue
---

# print 纸张自定义大小

项目采用[vue3-print-nb
](https://www.npmjs.com/package/vue3-print-nb)插件，具体使用可移步官网介绍

## 踩坑纪要

#### 1. 样式表里的 size 属性不支持字符串

#### 2. 在.html 文件里这样写可以访问到下列属性，但样式会覆盖到全局

```vue
<style title="index" media="print">
```

```js
for (const item of document.styleSheets)
  console.log(item, item.title, item.media.mediaText);
```

#### 3. 在.vue 文件里这样写打印样式才生效

```js
<style scoped> @media print {} </style>
```

## 具体实现

vue 部分代码

```js
<style scoped title="index">
/* @media print 必须写这里 */
@media print {
  @page {
    /*  1in=96px */
    size: 20cm 10cm;  /* 有效 */
    size: "20cm" "10cm";  /*无效 */
  }

}
</style>
```

js

```js
const setPrintPageStyle = () => {
  // 遍历所有样式表
  for (const item of document.styleSheets) {
    const list = [...item.cssRules];
    list.some((rule, i) => {
      // 查找打印样式表
      if (rule?.media?.mediaText === "print") {
        const newRule = `
          @media print {
            @page { 
              size: ${sizeObj.paperWidth}cm ${sizeObj.paperHeight}cm; 
            }
            #printTest {
              width: 100%;
              height: 100%;
              border: 2px solid red;
            }
            .button {
              display: none;
            }}`;

        item.deleteRule(i);
        item.insertRule(newRule, i);
        return true;
      }
    });
  }
};
```
