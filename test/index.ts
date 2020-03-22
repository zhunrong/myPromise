import { Promise2 } from '../src/promise'


// test
const p0 = Promise2.race([
  new Promise2((resolve, reject) => {
    setTimeout(() => {
      reject(1)
    }, 1000)
  }),
  new Promise2((resolve, reject) => {
    setTimeout(() => {
      resolve(2)
    }, 2000)
  }),
  new Promise2((resolve, reject) => {
    setTimeout(() => {
      reject(3)
    }, 3000)
  })
])

p0.then(value => {
  console.log('value', value)
}, reason => {
  console.log('reason', reason)
})
