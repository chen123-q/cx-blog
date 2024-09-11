---
description: JavaScript在浏览器中的运行机制
date: 2023-05-17
tag:
  - 前端
tags:
  - JavaScript
---

# 进程与线程

## 二者关系

### 进程

官方意思：**进程是 CPU 资源分配的最小单位**， 字面意思就是进行中的程序。每个进程独立运行且拥有自己的资源空间

### 线程

官方意思：**线程是 CPU 调度的最小单位**，一个进程至少有一个线程。JS 的运作决定了它只能是单线程。`Web Worker`中，子线程是完全受主线程控制的且不得操作 DOM。

## 浏览器

每打开一个 tab 页就会产生一个进程。

### 浏览器的一些主要进程

1. 浏览器进程（负责界面展示，用户交互，网络资源管理下载等等，该进程只有一个）
2. 插件进程（使用插件时才创建）
3. GPU 进程 （也只有一个，用于 3D 绘制）
4. **渲染进程（即浏览器内核，负责页面渲染，脚本执行，事件处理等，是多线程）**

### 渲染进程包含哪些

#### GUI 渲染线程

1. 解析`html`生成 DOM 树，解析`css`生成 CSS 规则树，将 DOM 树和 CSS 规则树结合生成渲染树
2. 修改元素颜色页面重绘，修改元素大小页面回流
3. **GUI 渲染线程与 JS 引擎线程互斥**

#### JS 引擎线程

1. JS 内核，负责处理 Javascript 脚本程序
2. 一个 Tab 页(渲染进程)只有一个 JS 线程运行 JS 程序
3. **JS 引擎线程会阻塞 GUI 渲染线程**

#### 事件触发线程

1. 用来控制事件循环，管理事件队列(task queue)
2. 异步回调排队等待

#### 定时触发器线程

1. `setInterval`与`setTimeout`所在线程
2. 通过单独线程来计时并触发定时，计时完将回调添加到任务队列
3. W3C 规定`setTimeout`中低于 4ms 的时间间隔算为 4ms

#### 异步 http 请求线程

1. 在`XMLHttpRequest`连接后通过浏览器新开一个线程请求
2. 异步事件有结果后，将其回调函数放入事件队列中

# 事件循环（Event Loop）

## 基础

JS 分为同步任务和异步任务，同步任务都在主线程上执行，形成一个执行栈。主线程之外由事件触发线程维护一个任务队列，当异步任务有了执行结果，就会在任务队列末尾添加一个事件回调，当执行栈的同步任务执行完就会从任务队列读取第一个任务压入执行栈执行。

**注意：1.定时触发线程只负责定时器，异步请求线程只关注网络请求。他们不关心结果，等任务完成就把回调交给事件触发线程 2.事件触发线程只关注异步回调 3.JS 引擎线程只会执行执行栈中的任务，执行完就去任务队列读取任务继续执行**

## 宏微任务

1. 每次在执行栈中的代码都是一个宏任务，每个宏任务会从头到尾执行完毕
2. 浏览器会在当前宏任务执行结束后立即执行当前宏任务产生的所有微任务再进行 GUI 渲染 即**宏任务->微任务->GUI 渲染->宏任务->...**

#### 常见宏任务

1. 主代码块
2. `setTimeout` / `setInterval`
3. `setImmediate()` -Node
4. `requestAnimationFrame()` -浏览器

#### 常见微任务

1. `process.nextTick()` -Node
2. `Promise.then()`
3. `catch`
4. `finally`
5. `MutationObserver`

## 完整的 Event Loop

1.  整体的 script(第一个宏任务)开始执行的时候，会把所有代码分为同步、异步两部分，同步任务直接进入主线程依次执行，异步任务会再分为宏任务和微任务
2.  宏任务进入到`Event Table`中，并在里面注册回调函数，每当指定的事件完成时，`Event Table`会将这个函数移到`Event Queue`中
3.  微任务也会进入到另一个`Event Table`中，并在里面注册回调函数，每当指定的事件完成时，`Event Table`会将这个函数移到`Event Queue`中
4.  当主线程内的任务执行完毕，主线程为空时，会检查微任务的`Event Queue`，如果有任务，就全部执行，如果没有就执行下一个宏任务
5.  上述过程会不断重复

## Promise 与 async/await

### Promise

`new Promise()`里的是同步任务。`then()`里的是异步微任务

```js
new Promise((resolve) => {
  console.log(1);
  resolve(3);
}).then((res) => {
  console.log(res);
  console.log(4);
});
console.log(2);
// 输出1 2 3 4
```

### async/await

**紧跟着 await 后的那段代码相当于 new Promise()里的代码，其余之后的代码相当于 then()的异步代码。** 下列例子中紧挨着`await`的函数会立即执行

```js
function test2() {
  new Promise((resolve, reject) => {
    console.log(2);
    resolve(4);
  }).then((res) => {
    console.log(res);
    document.body.style = "background:green";
  });
}

setTimeout(() => {
  console.log(7);
  document.body.style = "background:red";
}, 300);

async function test() {
  console.log(1);
  await test2(); // test2执行完产生的微任务和下面的整体代码是两个微任务
  Promise.resolve(5).then((res) => {
    console.log(6);
    document.body.style = "background:blue";
  });
  document.body.style = "background:yellow";
  console.log(5);
}

test();
console.log(3);
// 输出1 2 3 4 5 6 7； 页面背景先蓝后红
```
