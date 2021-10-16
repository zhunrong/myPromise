const STATE = Symbol("[STATE]");
const CALLBACKS = Symbol("[CALLBACKS]");
const RESULT = Symbol("[RESULT]");

/**
 * fulfill promise
 */
function fulfillPromise(promise: MyPromise, value: any) {
  if (promise[STATE] !== "pending") return;
  promise[STATE] = "fulfilled";
  promise[RESULT] = value;
  setTimeout(() => {
    const callbacks = promise[CALLBACKS];
    while (callbacks.length) {
      const { onFulfilled, resolve, reject } = callbacks.shift()!;
      if (typeof onFulfilled === "function") {
        try {
          const x = onFulfilled(promise[RESULT]);
          resolve(x);
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(promise[RESULT]);
      }
    }
  }, 0);
}

/**
 * reject promise
 */
function rejectPromise(promise: MyPromise, reason: any) {
  if (promise[STATE] !== "pending") return;
  promise[STATE] = "rejected";
  promise[RESULT] = reason;
  setTimeout(() => {
    const callbacks = promise[CALLBACKS];
    while (callbacks.length) {
      const { onRejected, resolve, reject } = callbacks.shift()!;
      if (typeof onRejected === "function") {
        try {
          const x = onRejected(promise[RESULT]);
          resolve(x);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(promise[RESULT]);
      }
    }
  }, 0);
}

/**
 * promise resolution procedure
 */
function resolvePromise(promise: MyPromise, x: any) {
  if (promise === x) {
    rejectPromise(promise, new TypeError());
  } else if (x instanceof MyPromise) {
    if (x[STATE] === "fulfilled") {
      fulfillPromise(promise, x[RESULT]);
    } else if (x[STATE] === "rejected") {
      rejectPromise(promise, x[RESULT]);
    } else {
      x.then(
        (value) => {
          fulfillPromise(promise, value);
        },
        (reason) => {
          rejectPromise(promise, reason);
        }
      );
    }
  } else if (x && /function|object/.test(typeof x)) {
    let then;
    try {
      then = x.then;
    } catch (error) {
      return rejectPromise(promise, error);
    }
    if (typeof then === "function") {
      let flag = false;
      const resolve: Resolve = (value) => {
        if (flag) return;
        flag = true;
        resolvePromise(promise, value);
      };
      const reject: Reject = (reason) => {
        if (flag) return;
        flag = true;
        rejectPromise(promise, reason);
      };
      try {
        then.call(x, resolve, reject);
      } catch (error) {
        if (!flag) {
          rejectPromise(promise, error);
        }
      }
    } else {
      fulfillPromise(promise, x);
    }
  } else {
    fulfillPromise(promise, x);
  }
}

type Resolve = (value?: any) => void;
type Reject = (reason?: any) => void;
type Executor = (resolve: Resolve, reject: Reject) => void;
type OnFulfilled = (value: any) => any;
type OnRejected = (reason: any) => any;
type Callback = {
  onFulfilled?: OnFulfilled;
  onRejected?: OnRejected;
  resolve: Resolve;
  reject: Reject;
};

export class MyPromise {
  static reject(reason: any) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static resolve(value: any) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }

  static all(promises: MyPromise[]) {
    let count = promises.length;
    const results: any[] = [];
    return new MyPromise((resolve, reject) => {
      if (count === 0) {
        return resolve(results);
      }
      promises.forEach((promise, index) => {
        promise.then(
          (value) => {
            results[index] = value;
            if (--count === 0) {
              resolve(results);
            }
          },
          (reason) => reject(reason)
        );
      });
    });
  }

  [STATE]: "pending" | "fulfilled" | "rejected" = "pending";
  [RESULT]: any = null;
  [CALLBACKS]: Callback[] = [];

  constructor(executor: Executor) {
    const resolve: Resolve = (value) => resolvePromise(this, value);
    const reject: Reject = (reason) => rejectPromise(this, reason);
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled?: OnFulfilled, onRejected?: OnRejected) {
    return new MyPromise((resolve, reject) => {
      this[CALLBACKS].push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
    });
  }

  catch(onRejected: OnRejected) {
    return this.then(undefined, onRejected);
  }
}

export default MyPromise;
