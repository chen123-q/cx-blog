---
title: JS的参数传递与手写call，apply，bind，new
description: 手写call，apply，bind，new
date: 2023-05-21
tag:
  - 前端
tags:
  - JavaScript
---

# js 参数传递

先贴一段《JavaScript 高级程序设计》的介绍

> ECMAScript 中所有函数的参数都是按值传递的。这意味着函数外的值会被复制到函数内部的参数中，就像从一个变量复制到另一个变量一样。如果是原始值，那么就跟原始值变量的复制一样，如果是引用值，那么就跟引用值变量的复制一样。

## 原始类型（按值传递）

```js
function addTen(num) {
  num += 10;
  console.log(num); // 30
}
let count = 20;

addTen(count);
console.log(count); // 20
```

## 引用类型（按共享传递）

```js
// case1
function changeName(obj) {
  obj.name = "newName";
  console.log(obj.name); // 'newName'
}
let person = {
  name: "cx",
};

changeName(person);
console.log(person.name); // 'newName'

// case2
function changeName(obj) {
  obj = { name: "newName" };
  console.log(obj.name); // 'newName'
}
let person = {
  name: "cx",
};

changeName(person);
console.log(person.name); // 'cx'
```

那为什么 case1 能按引用传递呢？因为**基本类型值存储于栈内存中，传递的就是当前值**，修改不会影响原有变量的值。而**引用类型在栈中存的是地址，传递的是地址索引，修改的是该地址在堆内存中的值**。例子 2 中将`obj`重新赋值为另一个地址，所以它不会影响到`person`对象。

# call

## 分析 call

### 具体用法

```js
function showVal() {
  console.log("实参", ...arguments);
  return `当前值是${this.value}`;
}

var value = 2;
const obj = {
  value: 1,
};
showVal.call(obj, { aa: 111 }, { b: 222 }); // // 实参 { aa: 111 } { b: 222 } 当前值是1
showVal.call(null, { aa: 111 }, { b: 222 }); //  // 实参 { aa: 111 } { b: 222 } 当前值是2
```

### 简要分析

1.  改变了`this`指向
2.  运行了`showVal`函数
3.  能传递指定参数
4.  不传`this`参数时，`this`指向全局（浏览器指向`window`，node 环境指向`global` / `globalThis`）

## 实现 call

### 步骤

1.  将调用的函数设置为对象的属性
2.  执行该函数并返回值
3.  删除该函数

### 实现

```js
Function.prototype.myCall1 = function (context) {
  let args = Array.prototype.slice.call(arguments, 1);
  context ??= globalThis;
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
};

//测试
window.value = 2;
function showVal() {
  console.log("实参", ...arguments);
  return `当前值是${this.value}`;
}

const obj = {
  value: 1,
};

console.log(showVal.myCall1(obj, { aa: 111 }, { b: 222 })); // 实参 { aa: 111 } { b: 222 } 当前值是1
console.log(showVal.myCall1(null, { aa: 111 }, { b: 222 })); // 实参 { aa: 111 } { b: 222 } 当前值是2
```

### 优化

```js
Function.prototype.myCall2 = function (context, ...args) {
  context ??= globalThis;
  let fnSymbol = Symbol(); // 保证键的唯一性
  context[fnSymbol] = this;
  let result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};
```

# apply

## 分析与实现

**与 call 类似，不过入参为数组，若不是数组则直接调用函数且参数为非对象类型时报错**

```js
Function.prototype.myApply = function (context, args) {
  if (typeof args !== "object")
    throw new TypeError("CreateListFromArrayLike called on non-object");
  context ??= globalThis;
  args = Array.isArray(args) ? args : [];
  let fnSymbol = Symbol();
  context[fnSymbol] = this;
  let result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

window.value = 2;
function showVal() {
  console.log("实参", ...arguments);
  return `当前值是${this.value}`;
}

const obj = {
  value: 1,
};

console.log(showVal.apply(obj, { aa: 111 }, { b: 222 })); // 实参  当前值是1

console.log(showVal.myApply(obj, [{ aa: 111 }, { b: 222 }])); // 实参 { aa: 111 } { b: 222 } 当前值是1
console.log(showVal.myApply(null, { aa: 111 }, { b: 222 })); // 实参  当前值是2
```

# bind

## 分析 bind

### 具体用法

```js
var value = 2;
function showVal() {
  console.log("实参", ...arguments);
  return `当前值是${this.value}`;
}

const obj = {
  value: 1,
};

const _bind = showVal.bind(obj, "params1");
console.log(_bind("params2")); // 实参 params1 params2;  当前值是1
```

### 简要分析

1.  改变`this`指向，返回一个函数
2.  `bind`函数和它返回的函数都可以接收参数

## 实现 bind

```js
Function.prototype.myBind = function (context) {
  const self = this;
  let args = Array.prototype.slice.call(arguments, 1);
  return function () {
    let bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(context, args.concat(bindArgs));
  };
};

// rest参数写法
Function.prototype.myBind2 = function (context, ...args) {
  return (...args2) => {
    return this.call(context, ...args, ...args2);
  };
};

window.value = 2;
function showVal() {
  console.log("实参", ...arguments);
  return `当前值是${this.value}`;
}

const obj = {
  value: 1,
};

const _bind = showVal.myBind(null, "params1");
console.log(_bind("params2")); // 实参 params1 params2;  当前值是1
```

## 构造函数效果模拟

> 一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

**也就是当 bind 返回的函数当构造函数使用时，调用 bind 时传入的 this 会失效，但其他参数依然会生效**

### bind 演示

```js
window.value = 2;
function showVal(name, age) {
  this.name = name;
  console.log("值:", this.value, "参数", arguments);
}
const obj = {
  value: 1,
};

const newBind = showVal.bind(obj, "cx");
newBind("params2"); //  值: 1 参数: Arguments(2) ['cx', 'params2']
console.log("----------------");
const foo = new newBind(24); // 值: undefined 参数: Arguments(2) ['cx', 24]
console.log(foo); // showVal { name: 'cx' }
```

### 构造函数效果实现

```js
function showVal(name, age) {
  this.name = name;
  console.log("值:", this.value, "参数", arguments);
}
showVal.prototype.xxx = "xxx";

const obj = {
  value: 1,
};

Function.prototype.myBind = function (context, ...args) {
  const self = this;
  //空函数进行中转
  const Fntemp = function () {};

  const FBound = function (...args2) {
    return self.apply(this instanceof Fntemp ? this : context, [
      ...args,
      ...args2,
    ]);
  };

  // FBound.prototype = this.prototype // 直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype
  Fntemp.prototype = this.prototype;
  FBound.prototype = new Fntemp();

  return FBound;
};

const newBind = showVal.myBind(obj, "cx");
newBind("params2"); //  值: 1 参数: Arguments(2) ['cx', 'params2']
console.log("----------------");
const foo = new newBind(24); // 值: undefined 参数: Arguments(2) ['cx', 24]
console.log(foo); // FBound {name: 'cx'}
```

# new

## new 的过程

《JavaScript 高级程序设计》里是这么介绍的

1.  在内存中创建一个新对象
2.  这个新对象内部的`[[Prototype]]`特性被赋值为构造函数的`prototype`属性
3.  构造函数内部的`this`被赋值为这个新对象（即`this`指向新对象）
4.  执行构造函数内部的代码（给新对象添加属性）
5.  如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象

## 实现 new

```js
function newFn(fatherFn, ...args) {
  if (typeof fatherFn !== "function")
    return `the frist param must be a function`;
  let obj = Object.create(fatherFn.prototype);
  let res = fatherFn.call(obj, ...args);
  return res instanceof Object ? res : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
  this.xxx = "xxx";
  return null;
}
Person.prototype.say = function () {
  console.log(`I am ${this.name}, I'm ${this.age} years old. `);
};

// 测试一下
const person1 = newFn(Person, "cx", 24);
console.log(person1); // Person { name: 'cx', age: 24, xxx: 'xxx' }
person1.say(); // I am cx, I'm 24 years old.
```
