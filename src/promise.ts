const STATE = Symbol("STATE");
const VALUE = Symbol("VALUE");
const REASON = Symbol("REASON");
const CALLBACKS = Symbol("CALLBACKS");

function changePromiseState(
  promise: MyPromise,
  state: "fulfilled" | "rejected",
  value: any
) {
  if (promise[STATE] !== "pending") return;
  promise[STATE] = state;
  if (state === "fulfilled") {
    promise[VALUE] = value;
  } else {
    promise[REASON] = value;
  }
  runCallbacks(promise);
}

function runCallbacks(promise: MyPromise) {
  setTimeout(() => {
    const callbacks = promise[CALLBACKS];
    while (callbacks.length) {
      const { onFulfilled, onRejected, resolve, reject } = callbacks.shift()!;
      switch (promise[STATE]) {
        case "fulfilled":
          if (typeof onFulfilled === "function") {
            try {
              const x = onFulfilled(promise[VALUE]);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          } else {
            resolve(promise[VALUE]);
          }
          break;
        case "rejected":
          if (typeof onRejected === "function") {
            try {
              const x = onRejected(promise[REASON]);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(promise[REASON]);
          }
          break;
      }
    }
  }, 0);
}

function promiseResolutionProcedure(promise: MyPromise, x: any) {
  if (promise === x) {
    changePromiseState(promise, "rejected", new TypeError());
  } else if (x instanceof MyPromise) {
    if (x[STATE] === "fulfilled") {
      changePromiseState(promise, "fulfilled", x[VALUE]);
    } else if (x[STATE] === "rejected") {
      changePromiseState(promise, "rejected", x[REASON]);
    } else {
      x.then(
        (value) => {
          changePromiseState(promise, "fulfilled", value);
        },
        (reason) => {
          changePromiseState(promise, "rejected", reason);
        }
      );
    }
  } else if (x && /function|object/.test(typeof x)) {
    let then;
    try {
      then = x.then;
    } catch (error) {
      return changePromiseState(promise, "rejected", error);
    }
    if (typeof then === "function") {
      let flag = false;
      const resolvePromise: Resolve = (value) => {
        if (flag) return;
        flag = true;
        promiseResolutionProcedure(promise, value);
      };
      const rejectPromise: Reject = (reason) => {
        if (flag) return;
        flag = true;
        changePromiseState(promise, "rejected", reason);
      };
      try {
        then.call(x, resolvePromise, rejectPromise);
      } catch (error) {
        if (!flag) {
          changePromiseState(promise, "rejected", error);
        }
      }
    } else {
      changePromiseState(promise, "fulfilled", x);
    }
  } else {
    changePromiseState(promise, "fulfilled", x);
  }
}

type Resolve = (value: any) => void;
type Reject = (reason: any) => void;
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

  [STATE]: "pending" | "fulfilled" | "rejected" = "pending";
  [VALUE]: any = null;
  [REASON]: any = null;
  [CALLBACKS]: Callback[] = [];

  constructor(executor: Executor) {
    const resolve: Resolve = (value) => {
      promiseResolutionProcedure(this, value);
    };
    const reject: Reject = (reason) => {
      changePromiseState(this, "rejected", reason);
    };
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
}

export default MyPromise;
