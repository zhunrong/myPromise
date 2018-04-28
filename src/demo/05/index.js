import _Promise from './_promise';

// promise
// then函数的链式写法

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p = new P((resolve, reject) => {
        setTimeout(() => {
            resolve('p1');
        }, 1000)
    })

    p.then(res => {
        console.log(res);
        return new P((resolve, reject) => {
            setTimeout(() => {
                resolve('p2')
            }, 1000)
        })
    }).then(res => {
        console.log(res);
        return new P((resolve, reject) => {
            setTimeout(() => {
                resolve('p3');
            }, 1000)
        })
    }).then(res => {
        console.log(res);
    })

    console.log(p);

}