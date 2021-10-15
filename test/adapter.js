const { MyPromise } = require("../lib/promise");

module.exports = {
  resolved(value) {
    return MyPromise.resolve(value);
  },
  rejected(reason) {
    return MyPromise.reject(reason);
  },
  deferred() {
    const object = {
      promise: null,
      resolve: null,
      reject: null,
    };
    const promise = new MyPromise((resolve, reject) => {
      object.resolve = resolve;
      object.reject = reject;
    });
    object.promise = promise;
    return object;
  },
};
