import { MyPromise } from '../src/promise'

const promise = new MyPromise((resolve) => {
  console.log(1);
  resolve(3);
});

promise.then(value => {
  console.log(value);
})

console.log(2);
