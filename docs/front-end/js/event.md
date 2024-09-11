---
description: 关于JS事件
date: 2023-08-13
tag:
  - 前端
tags:
  - JavaScript
---

# js 事件

### 事件类型

#### 鼠标事件

- click
- dbclick

- mousedown 鼠标按下
- mousemove
- mouseup 鼠标松开按钮
- mouseover 鼠标移动到某个元素上方时

- mouseenter 鼠标首次进入元素内触发
- mouseleave 鼠标离开元素触发

#### 键盘事件

- keydown 任意键按下 =>按住不放持续触发
- keypress 字符键按下 =>按住不放持续触发
- keyup 按键抬起

#### HTML 事件

1.  文本内容型

- input 输入框输入
- change
- focus
- blur
- select 文本框（input,textarea）文本被选中时

2. 版面内容型

- submit
- reset

3. 窗口型

- load => window.onload 窗口加载完
- unload => window.onload 窗口完全卸载

- resize
- scroll

### 事件传播

1. 传播类型

- 冒泡：从目标元素到顶层元素 （默认类型）
- 捕获：从顶层元素到目标元素

2. 事件流（三个阶段）

- 事件捕获阶段 => 目标事件阶段 => 事件冒泡阶段

3. 阻止冒泡 ： `stopPropagation`

### 事件绑定

1. DOM0 级事件

- 会覆盖已有的同类型绑定事件

```js
<input id="text" type="text" onkeyup="keyup(event)" />;

function keyup(event) {
  event = event || window.event;
  console.log(event.target.value);
}

document.querySelector("#text").keyup = function () {
  console.log(this.value);
};
```

2. DOM2 级事件

- 可以添加多个事件，依次触发。
- 通过`addEventListener`添加的事件只能通过`removeEventListener`移除。
- `removeEventListener`只能移除具名函数，不能移除匿名函数。

target.addEventListener(type, listener, useCapture)

### 事件委托 / 代理

```js
<ul id="list">
  <li>value1</li>
  <li>value2</li>
  <li>value3</li>
  <li>value4</li>
</ul>;

document.addEventListener("DOMContentLoaded", function () {
  let list = document.querySelector("#list");
  list.addEventListener("click", function (e) {
    if (e.target.nodeName === "LI") {
      console.log(e.target.innerText);
    }
  });
});
```
