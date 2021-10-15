const STATE = Symbol('STATE');
const VALUE = Symbol('VALUE');
const REASON = Symbol('REASON');
const CALLBACKS = Symbol('CALLBACKS');

function changePromiseState(promise: MyPromise, state: 'fulfilled' | 'rejected', value: any) {
  if (promise[STATE] !== 'pending') return 1;
  promise[STATE] = state;
  if (state === 'fulfilled') {
    promise[VALUE] = value;
  } else {
    promise[REASON] = value;
  }
  return 0;
}

function promiseResolutionProcedure(promise: MyPromise, x: any) {
  if (promise === x) {
    changePromiseState(promise, 'rejected', new TypeError());
  } else if (x instanceof MyPromise) {
    if (x[STATE] === 'fulfilled') {
      changePromiseState(promise, 'fulfilled', x[VALUE]);
    } else if (x[STATE] === 'rejected') {
      changePromiseState(promise, 'rejected', x[REASON]);
    } else {
      x.then(value => {
        changePromiseState(promise, 'fulfilled', value);
      }, reason => {
        changePromiseState(promise, 'rejected', reason);
      });
    }
  } else if (x instanceof Object) {
    let then;
    try {
      then = x.then;
    } catch (error) {
      return changePromiseState(promise, 'rejected', error);
    }
    if (typeof then === 'function') {
      let flag = false;
      const resolvePromise: Resolve = (value) => {
        if (flag) return;
        promiseResolutionProcedure(promise, value);
        flag = true;
      }
      const rejectPromise: Reject = (reason) => {
        if (flag) return;
        changePromiseState(promise, 'rejected', reason);
        flag = true;
      }
      try {
        then.call(x, resolvePromise, rejectPromise)
      } catch (error) {
        if (!flag) {
          changePromiseState(promise, 'rejected', error);
        }
      }
    } else {
      changePromiseState(promise, 'fulfilled', x);
    }
  } else {
    changePromiseState(promise, 'fulfilled', x);
  }
}

type Resolve = (value: any) => void;
type Reject = (reason: any) => void;
type Executor = (resolve: Resolve, reject: Reject) => void
type OnFulfilled = (value: any) => any;
type OnRejected = (reason: any) => any;
type Callback = {
  onFulfilled?: OnFulfilled;
  onRejected?: OnRejected;
  promise2: MyPromise;
  resolve: Resolve;
  reject: Reject;
};

export class MyPromise {

  static reject(reason: any) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    })
  }

  static resolve(value: any) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    })
  }

  [STATE]: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  [VALUE]: any = null;
  [REASON]: any = null;
  [CALLBACKS]: Callback[] = [];

  constructor(executor: Executor) {
    const resolve: Resolve = (value) => {
      const code = changePromiseState(this, 'fulfilled', value);
      if (code) return;
      setTimeout(() => {
        const callbacks = this[CALLBACKS];
        while (callbacks.length) {
          const { onFulfilled, promise2 } = callbacks.shift()!;
          if (typeof onFulfilled === 'function') {
            try {
              const x = onFulfilled(value);
              promiseResolutionProcedure(promise2, x);
            } catch (error) {
              console.log(promise2, onFulfilled)
              changePromiseState(promise2, 'rejected', error);
            }
          } else {
            changePromiseState(promise2, 'fulfilled', value);
          }
        }
      }, 0)
    }
    const reject: Reject = (reason) => {
      const code = changePromiseState(this, 'rejected', reason);
      if (code) return;
      setTimeout(() => {
        const callbacks = this[CALLBACKS];
        while (callbacks.length) {
          const { onRejected, promise2 } = callbacks.shift()!;
          if (typeof onRejected === 'function') {
            try {
              const x = onRejected(reason);
              promiseResolutionProcedure(promise2, x);
            } catch (error) {
              changePromiseState(promise2, 'rejected', error);
            }
          } else {
            changePromiseState(promise2, 'rejected', reason);
          }
        }
      }, 0)
    }
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled?: OnFulfilled, onRejected?: OnRejected) {
    const callback = {
      onFulfilled,
      onRejected
    } as Callback;
    const promise2 = new MyPromise((resolve, reject) => {
      callback.resolve = resolve;
      callback.reject = reject;
      // this[CALLBACKS].push({
      //   onFulfilled,
      //   onRejected,
      //   promise2,
      //   resolve,
      //   reject,
      // });
    });
    callback.promise2 = promise2;
    this[CALLBACKS].push(callback);
    return promise2;
  }
}

export default MyPromise