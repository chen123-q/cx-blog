---
description: 理解JavaScript原型与执行上下文
date: 2023-05-06
tag:
  - 前端
tags:
  - JavaScript
---

# 原型

## 什么是原型

1.  每个函数都有一个`prototype`属性。这个属性指向通过调用该构造函数创建出来的对象的原型（即**实例的原型**）。每个对象 （除了`null`） 都可以通过`Object.getPrototypeOf()`得到该对象的原型。（\_\_proto\_\_已弃用）
2.  每个原型的`constructor`属性又指回与它相关联的构造函数

### 代码实例

```JS
//1.普通函数
function Person() {
}
Person.prototype.name = "cx"

const person1 = new Person()
const person2 = new Person()

console.log(person1.name)  //  cx
console.log(person2.name)  //  cx

//都指向实例的原型
console.log(Object.getPrototypeOf(person1)) //  {name: 'cx', constructor: ƒ}
console.log(Person.prototype) //  {name: 'cx', constructor: ƒ}
console.log(Person.prototype === Object.getPrototypeOf(person1)) //  true

//constructor 指回构造函数
console.log(Person.prototype.constructor)  //  ƒ Person () {}
console.log(Person.prototype.constructor === Person)  //  true

//当不能读取到constructor 属性时，会从 person 的原型也就是 Person.prototype 中读取
console.log(person1.constructor === Person.prototype.constructor)  // true
console.log(person1.constructor === Person)  // true
```

## 原型链

当访问一个对象上不存在的属性时，它就会去该对象的原型上查找。原型对象也是一个对象，如果原型对象上没有就会从原型对象的原型上找，直到找到`null`。由此形成的链式结构即为原型链，通过原型链可以实现继承和属性共享等功能。

```js
function Person() {}
console.log(Object.getPrototypeOf(Person.prototype) === Object.prototype); // true

console.log(Object.getPrototypeOf(Object.prototype) === null); // true
```

## 图示

![原型链.webp](https://pic4.zhimg.com/v2-8828ba987939772b79480f7c959ccc3f_b.jpg)

# 执行上下文

JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文。当全局代码执行时会创建一个全局执行上下文并将其压入栈中，全局上下文在应用程序退出前才会被销毁。当调用一个函数时会创建该函数的执行上下文并压入栈中，函数执行完会从上下文栈中弹出该函数上下文。**每个上下文都包含变量对象、作用域链、this 三个重要属性。**

## 变量对象 (Variable object，VO)

### 全局上下文

全局上下文中的变量对象就是全局对象，在顶层 JavaScript 代码中，可以用`this`关键字引用全局对象。

```js
// 通过this引用全局对象
console.log(this); //  Window {...}

//  全局对象是由 Object 构造函数实例化的一个对象
console.log(this instanceof Object); //  true

//  通过var关键字声明的变量会自动挂载在全局对象上
var a = 1;
console.log(window.a); //  1
this.window.b = 2;
console.log(this.b); //  2
```

### 函数上下文

函数上下文中将**活动对象(activation object, AO)** 用作变量对象。活动对象最初只有一个定义变量：`arguments`。在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值(函数声明会覆盖同名属性，变量声明则不会干扰已存在的属性)；在代码执行阶段，会再次修改变量对象的属性值

```js
function foo(a, b, c) {
  var b = 100;
  function c() {}
  var d = function () {};

  b = 200;
}

foo(1, 2, 3);

//进入执行上下文的AO
AO = {
  arguments: {
    0: a,
    1: b,
    3: c,
    length: 3,
  },
  a: 1,
  b: undefined,
  c: function c() {},
  d: undefined,
};

//代码执行时的AO
AO = {
  arguments: {
    0: a,
    1: b,
    3: c,
    length: 3,
  },
  a: 1,
  b: 200,
  c: function c() {},
  d: function () {},
};
```

## 作用域

作用域指代码中定义变量的区域。全局作用域指的是整个 JavaScript 程序的作用域，其生命周期从程序开始执行到程序结束，全局作用域内定义的变量可以在程序中的任何位置被访问。局部作用域则是在函数中定义的变量所属的作用域，其生命周期只存在于函数执行期间。在函数内部定义的变量只能在函数内部被访问。

### 词法作用域

js 采用词法作用域，也叫**静态作用域**。函数的作用域在函数定义的时候就决定了

```js
// case 1
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f();
}
checkscope(); //  "local scope"

// case 2
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f;
}
checkscope()(); //  "local scope"
```

引用《JavaScript 权威指南》的回答

> JavaScript 函数的执行用到了作用域链，这个作用域链是在函数定义的时候创建的。嵌套的函数 f() 定义在这个作用域链里，其中的变量 scope 一定是局部变量，不管何时何地执行函数 f()，这种绑定在执行 f() 时依然有效。

### 作用域链

上下文中的代码在执行的时候，会创建变量对象的一个作用域链（scope chain）。当查找变量时会先从当前上下文的变量对象中找，如果没找到会从父级上下文变量对象中找，直至找到全局上下文，由此构成的链表结构称为作用域链

## this

### this 指向

1.  普通调用，默认指向全局（浏览器 -> `window`,`node` -> `global`,严格模式 -> `undefined`）
2.  对象调用时指向对象
3.  使用 `call`,`appply`,`bind`时指向指定的参数
4.  使用 `new`关键字时指向新创建的对象
5.  使用箭头函数时指向父级的 this

### 优先级

**`new` > `call`/`appply`/`bind` > 对象调用**

```js
window.value = 2;
const obj = {
  value: 1,
  showVal() {
    console.log(this.value);
  },
};
obj.showVal(); // 1   obj调用
const { showVal } = obj;
showVal(); // 2 window 调用
```
