import _Promise from './_promise';

// promise
// then函数的链式写法   reject被调用

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p1 = new P((resolve, reject) => {
        setTimeout(() => {
            resolve('p1');
        }, 1000)
    })

    p1.then(res => {
        console.log('then1', res);
        const p2 = new P((resolve, reject) => {
            setTimeout(() => {
                resolve('p2')
            }, 1000)
        })
        console.log(p2);
        return p2;
    }).then(res => {
        console.log('then2', res);
        const p3 = new P((resolve, reject) => {
            setTimeout(() => {
                reject('p3');
            }, 1000)
        })
        console.log(p3);
        return p3;
    }).catch(err => {
        console.log('catch', err);
    })

    console.log(p1);

}