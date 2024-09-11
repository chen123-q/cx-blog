---
description: 学习 Promise 功能与手写尝试
date: 2023-07-26
tag:
  - 前端
tags:
  - JavaScript
---

# promise

### resolve 和 reject

promise 效果

```js
const promise1 = new Promise((resolve, reject) => {});

const promise2 = new Promise((resolve, reject) => {
  resolve("成功");
  reject("失败");
});

const promise3 = new Promise((resolve, reject) => {
  throw "失败";
});

console.log(promise1); // Promise {<pending>}
console.log(promise2); // Promise {<fulfilled>: '成功'}
console.log(promise3); // Promise {<rejected>: '失败'}
```

可以看出 promise

1. 有`pending`，`fulfilled`，`rejected`三个状态,初始状态为`pending`。
2. 执行`resolve`状态变为`fulfilled` ，执行`reject`状态变为`rejected` ; 抛出异常状态变为`rejected` 。
3. 状态不可逆： 在`fulfilled`或`rejected`之后，状态将停止改变。

自己 try 一下

```js
const PENDING = "pending";
const REJECTED = "rejected";
const FULFILLED = "fulfilled";

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.result = null;
    this.initBind();
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  initBind() {
    // 将resolve和reject的this指向实例
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    if (this.state !== PENDING) return;
    this.state = FULFILLED;
    this.result = value;
  }

  reject(reason) {
    if (this.state !== PENDING) return;
    this.state = REJECTED;
    this.result = reason;
  }
}

//************** test **************

const promise1 = new MyPromise((resolve, reject) => {
  resolve("成功");
  reject("失败");
});

const promise2 = new MyPromise((resolve, reject) => {
  throw "失败";
});

console.log(promise1); // MyPromise {state: 'fulfilled', result: '成功'}
console.log(promise2); // MyPromise {state: 'rejected', result: '失败'}
```

### then

promise 效果

```js
const promise1 = new Promise((resolve, reject) => {
  reject("失败");
}).then(
  (res) => console.log(res),
  (err) => console.log(err) // 失败
);

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功");
  }, 2000);
}).then(
  (res) => console.log(res), // 2s后输出成功
  (err) => console.log(err)
);

const promise3 = new Promise((resolve, reject) => {
  reject("最终结果：");
})
  .then(
    (res) => res,
    (err) => err
  )
  .then(
    (res) => console.log(res + 1), // 最终结果：1
    (err) => console.log(err + 2)
  );

const promise4 = new Promise((resolve, reject) => {
  resolve(100);
})
  .then(
    (res) => new Promise((resolve, reject) => reject(2 * res)),
    (err) => err
  )
  .then(
    (res) => console.log("成功", res),
    (err) => console.log("失败", err) // 失败：200
  );
```

小结一下 then 特点

1. 接收成功和失败的回调
2. promise 状态为`fulfilled`时执行成功回调，为`rejected`时执行失败回调。
3. 回调会等待异步任务完成后再执行 （如 promise2）
4. then 可以链式调用，值可以透传
5. then 返回一个新的 promise:返回值为失败，新 promise 状态就是失败，返回值为成功，新 promise 状态就是成功 （如 promise4）
6. 当 then 返回值为非 promise 对象时会被包装成 promise 对象返回，新 promise 状态为成功（如 promise3）

先 try 前三点

```js
const PENDING = "pending";
const REJECTED = "rejected";
const FULFILLED = "fulfilled";

class MyPromise {
  constructor(executor) {
    this.state = PENDING; // 状态
    this.result = null; // 最终结果
    this.onFulfilledCB = []; // 成功回调
    this.onRejectedCB = []; // 失败回调
    this.initBind();
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  initBind() {
    // 将resolve和reject的this指向实例
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    if (this.state !== PENDING) return;
    this.state = FULFILLED;
    this.result = value;
    this.onFulfilledCB.forEach((fn) => fn(this.result));
  }

  reject(reason) {
    if (this.state !== PENDING) return;
    this.state = REJECTED;
    this.result = reason;
    this.onRejectedCB.forEach((fn) => fn(this.result));
  }

  then(onFulfilled, onRejected) {
    // 确保是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function" ? onRejected : (reason) => reason;

    if (this.state === FULFILLED) {
      onFulfilled(this.result);
    }
    if (this.state === REJECTED) {
      onRejected(this.result);
    }
    if (this.state === PENDING) {
      this.onFulfilledCB.push(onFulfilled.bind(this));
      this.onRejectedCB.push(onRejected.bind(this));
    }
  }
}

//************** test **************

const promise1 = new MyPromise((resolve, reject) => {
  reject("失败");
}).then(
  (res) => console.log(res),
  (err) => console.log(err) // 失败
);

const promise2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功");
  }, 2000);
}).then(
  (res) => console.log(res), // 2s后输出成功
  (err) => console.log(err)
);
```

再 try 后三点

```js
const PENDING = "pending";
const REJECTED = "rejected";
const FULFILLED = "fulfilled";

class MyPromise {
  constructor(executor) {
    this.state = PENDING; // 状态
    this.result = null; // 最终结果
    this.onFulfilledCB = []; // 成功回调
    this.onRejectedCB = []; // 失败回调
    this.initBind();
    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }
  initBind() {
    // 将resolve和reject的this指向实例
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    if (this.state !== PENDING) return;
    this.state = FULFILLED;
    this.result = value;
    this.onFulfilledCB.forEach((fn) => fn(this.result));
  }

  reject(reason) {
    if (this.state !== PENDING) return;
    this.state = REJECTED;
    this.result = reason;
    this.onRejectedCB.forEach((fn) => fn(this.result));
  }

  then(onFulfilled, onRejected) {
    // 确保是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 返回新的MyPromise
    const thenPromise = new MyPromise((resolve, reject) => {
      // 封装一个函数用于递归
      const resPromise = (cb) => {
        // 用setTimeout模仿微任务
        setTimeout(() => {
          try {
            const val = cb(this.result);
            if (val && val === thenPromise) {
              throw new Error("不能返回自身！");
            }
            // 返回的是MyPromise接着then
            if (val instanceof MyPromise) {
              val.then(resolve, reject);
            } else {
              // 非Promise就成功
              resolve(val);
            }
          } catch (err) {
            reject(err);
            throw new Error(err);
          }
        });
      };

      if (this.state === FULFILLED) {
        resPromise(onFulfilled);
      }
      if (this.state === REJECTED) {
        resPromise(onRejected);
      }
      if (this.state === PENDING) {
        this.onFulfilledCB.push(resPromise.bind(this, onFulfilled));
        this.onRejectedCB.push(resPromise.bind(this, onRejected));
      }
    });

    return thenPromise;
  }
}

//************** test **************

const promise3 = new MyPromise((resolve, reject) => {
  reject("最终结果：");
});
promise3
  .then(
    (res) => res,
    (err) => err
  )
  .then(
    (res) => {
      setTimeout(() => console.log(res + 2), 2000);
    }, // 2后输出 最终结果：2
    (err) => console.log(err + 2)
  );

const promise4 = new MyPromise((resolve, reject) => {
  resolve(100);
})
  .then(
    (res) => new MyPromise((resolve, reject) => reject(2 * res)),
    (err) => err
  )
  .then(
    (res) => console.log("成功", res),
    (err) => console.log("失败", err) // 失败：200
  );
```

### 其他方法

#### 1. resolve

```js
static resolve(val) {
        return new MyPromise((resolve, reject) => {
            if (val instanceof MyPromise) {
                val.then(
                    (res) => resolve(res),
                    (rej) => reject(rej)
                );
            } else {
                resolve(val);
            }
        });
    }
```

#### 2. reject

```js
static reject(val) {
        return new MyPromise((resolve, reject) => {
            reject(val);

        });
    }
```

<!-- #### 3. all

```js

```

#### 4. allSettled

```js

```

#### 5. race

```js

```

#### 6.any

```js

``` -->
