const { MyPromise } = require('../lib/promise');

const promise1 = new MyPromise((resolve, reject) => {
  resolve(1);
})

const promise2 = promise1.then(value => value, reason => reason);

setTimeout(() => {
  console.log(promise1);
  console.log(promise2);
}, 10)