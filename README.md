# Promise

本仓库是对 **Promise** 的实现，兼容 **Promises/A+** 规范。

## Promises/A+

### 1. 术语

1. **“promise”** 是一个具有 **then** 方法的对象或函数，该方法的行为符合本规范。
2. **“thenable”** 是一个具有 **then** 方法的对象或函数。
3. **“value”** 是任何 JavaScript 合法值。
4. **“exception”** 是一个用 **throw** 语句抛出的异常。
5. **“reason”** 是一个用于指示为何 **promise** 被拒绝的原因。

### 2. 要求

#### 2.1. promise 状态

一个 **promise** 必定处于这三个状态之一：**pending**, **fulfilled**, **rejected**。

2.1.1. 当处于 **pending** 时，一个 **promise** 可能转变成 **fulfilled** 或 **rejected**。

2.1.2. 当处于 **fulfilled** 时，一个 **promise** 不能再转变成其他状态，且此时拥有一个不可变的 **value**。

2.1.3. 当处于 **rejected** 时，一个 **promise** 不能再转变成其他状态，且此时拥有一个不可变的 **reason**。

履行 **promise** 是指将该 **promise** 的状态从 **pending** 改为 **fulfilled** 并提供一个 **value**。

拒绝 **promise** 是指将该 **promise** 的状态从 **pending** 改为 **rejected** 并提供一个 **reason**。

#### 2.2. then 方法

一个 **promise** 必须提供一个 **then** 方法来访问它当前或最终的 **value** 或 **reason**。

一个 **promise** 的 **then** 方法接收2个参数：

```js
promise.then(onFulfilled, onRejected);
```

2.2.1. **onFulfilled** 和 **onRejected** 都是可选参数，当它们不是函数时，必须直接忽略。

2.2.2. 如果 **onFulfilled** 是一个函数，那么
   
- 它必须在 **promise** 状态变为 **fulfilled** 后被调用，且 **promise** 的 **value** 作为它的第一个参数。
- 它不能在 **promise** 状态变为 **fulfilled** 之前调用。
- 它不能调用超过1次。

2.2.3. 如果 **onRejected** 是一个函数，那么

- 它必须在 **promise** 状态变为 **rejected** 后被调用，且 **promise** 的 **reason** 作为它的第一个参数。
- 它不能在 **promise** 状态变为 **rejected** 之前调用。
- 它不能调用超过1次。

2.2.4. **onFulfilled** 或 **onRejected** 必须等到执行栈中同步代码执行之后才能调用。

2.2.5. **onFulfilled** 与 **onRejected** 必须当作一个普通函数调用，不影响 this 的默认指向。

2.2.6. 同一个 **promise** 的 **then** 方法可以调用多次

- 当 **promise** 状态变为 **fulfilled** 时，所有 **onFulfilled** 回调必须按照 **then** 方法调用顺序执行。
- 当 **promise** 状态变为 **rejected** 时，所有 **onRejected** 回调必须按照 **then** 方法调用顺序执行。

2.2.7. **then** 方法必须返回一个 **promise**

```js
promise2 = promise1.then(onFulfilled, onRejected);
```
 
- 如果 **onFulfilled** 或 **onRejected** 调用返回一个值 **x**，那么执行承诺处理流程 **\[\[Resolve\]\](promise2, x)**。
- 如果 **onFulfilled** 或 **onRejected** 抛出一个异常 **e**，那么必须以 **e** 作为 **reason** 拒绝 **promise2**。
- 如果 **onFulfilled** 不是一个函数并且 **promise1** 状态变为 **fulfilled**，那么 **promise2** 的状态必须变为 **fulfilled** 且与 **promise1** 拥有同样的 **value**。
- 如果 **onRejected** 不是一个函数并且 **promise1** 状态变为 **rejected**，那么 **promise2** 的状态必须变为 **rejected** 且与 **promise1** 拥有同样的 **reason**。

#### 2.3. 承诺处理流程

**承诺处理流程** 是一个抽象化的操作，它接收一个 **promise** 和一个 **value**，可以表示成 **\[\[Resolve\]\](promise, x)**。如果 **x** 是一个 **thenable**，并且 **x** 的行为表现得像一个 **promise**，那么会尝试让输入的 **promise** 采用 **x** 的状态，否则会以 **x** 作为 **value** 履行 **promise**。

这种处理方式允许不同的 **promise** 实现之间互相操作，前提是它们都暴露了符合本规范的 **then** 方法。

要运行 **\[\[Resolve\]\](promise, x)**，请执行以下步骤：

2.3.1. 如果 **promise** 和 **x** 引用同一个对象，那么就拒绝 **promise** 并以 **TypeError** 作为 **reason**。

2.3.2. 如果 **x** 是一个 **promise**，那么采用它的状态：

- 如果 **x** 处于 **pending**，那么**promise** 必须保持 **pending** 直到 **x** 状态转变。
- 如果 **x** 处于 **fulfilled**，那么以同样的 **value** 履行 **promise**。
- 如果 **x** 处于 **rejected**，那么以同样的 **reason** 拒绝 **promise**。

2.3.3. 否则，如果 **x** 是一个对象或函数，那么

- 首先将 **x.then** 缓存到变量 **then**；
- 如果检索 **x.then** 属性时抛出异常 **e**，那么以 **e** 作为 **reason** 拒绝 **promise**；
- 如果 **then** 是一个函数，那么执行 **then.call(x, resolvePromise, rejectPromise)**
   - 如果 **resolvePromise** 以参数 **y** 被调用，那么运行 **\[\[Resolve\]\](promise, y)**；
   - 如果 **rejectPromise** 以参数 **r** 被调用，那么以 **r** 作为 **reason** 拒绝 **promise**；
   - 如果 **resolvePromise** 和 **rejectPromise** 都被调用甚至多次调用，那么只处理第一次调用；
   - 如果调用 **then** 抛出异常 **e**
      - 如果 **resolvePromise** 或 **rejectPromise** 已被调用，就忽略之；
      - 否则以 **e** 作为 **reason** 拒绝 **promise**
- 如果 **then** 不是一个函数，那么以 **x** 作为 **value** 履行 **promise**。

2.3.4. 如果 **x** 不是对象或函数，那么以 **x** 作为 **value** 履行 **promise**。

如果一个 **promise** 通过一个参与循环 **thenable** 链的 **thenable** 来解析，这样 **\[\[Resolve\]\](promise, x)** 最终会再次调用 **\[\[Resolve\]\](promise, x)**，从而陷入无限递归。本规范鼓励但是不要求实现一个机制来检测这样的递归，并以 **TypeError** 作为 **reason** 拒绝这个 **promise**。