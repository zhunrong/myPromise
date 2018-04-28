import _Promise from './_promise';

// promise
// resolve函数参数是一个promise对象

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p1 = new P((resolve, reject) => {
        setTimeout(() => {
            resolve('p1');
            // reject('p1');
        }, 1000)

    })

    const p2 = new P((resolve, reject) => {

        resolve(p1);

    })

    p2.then(res => {
        console.log('then', res);
    }).catch(err => {
        console.log('catch', err);
    })


}