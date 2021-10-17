const { MyPromise } = require('../lib/promise');

const promise1 = new MyPromise((resolve, reject) => {
  // resolve(1);
  reject(2);
})

const promise2 = promise1.then(value => value, reason => reason);

const promise3 = promise1.catch(reason => new Error(reason));

setTimeout(() => {
  console.log(promise1);
  console.log(promise2);
  console.log(promise3);
}, 10)