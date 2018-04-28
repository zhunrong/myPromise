import _Promise from '../modules/promise';

//promise 执行顺序

function _promiseTest() {
    const p = new _Promise((resolve, reject) => {
        console.log('_Promise');
        resolve()
    })

    p.then(() => {
        console.log('resolved');
    })

    console.log('hello');
}


function promiseTest() {
    const p = new Promise((resolve, reject) => {
        console.log('Promise');
        resolve()
    })

    p.then(() => {
        console.log('resolved');
    })

    console.log('hello');
}



export {
    _promiseTest,
    promiseTest
}