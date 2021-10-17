const { MyPromise } = require('../lib/promise');

console.time();
const promise = MyPromise.race([
  // MyPromise.resolve(1),
  new MyPromise((resolve) => {
    setTimeout(resolve, 1000, 2);
  }),
  new MyPromise((resolve) => {
    setTimeout(resolve, 2000, 3);
  }),
  MyPromise.reject(4)
]);

promise.then(value => {
  console.log(value);
  console.timeEnd();
}).catch(reason => {
  console.log(reason);
  console.timeEnd();
})