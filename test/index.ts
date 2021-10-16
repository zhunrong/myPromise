import { MyPromise } from "../src/promise";

function thenable(value: any) {
  return {
    then(onFulfilled: (value: any) => void) {
      onFulfilled(value);
    },
  };
}

const promise = new MyPromise((resolve) => {
  resolve(thenable(thenable(3)));
});

setTimeout(() => {
  console.log(promise);
}, 30);
