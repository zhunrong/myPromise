import _Promise from './_promise';

// promise
// catch return一个promise实例

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p1 = new P((resolve, reject) => {
        setTimeout(() => {
            resolve('p1');
        }, 1000)
        // debugger;
        // throw new Error('p1');
    })


    p1.then(res => {
        console.log('then1', res);
        const p2 = new P((resolve, reject) => {
            setTimeout(() => {
                reject('p2');
            }, 1000)
        })
        return p2;
    }).catch(err => {
        console.log('catch1', err);
        const p3 = new P((resolve, reject) => {
            setTimeout(() => {
                resolve('p3');
            }, 1000)
        })
        return p3;
    }).then(res => {
        console.log('then2', res);
        const p4 = new P((resolve, reject) => {
            setTimeout(() => {
                reject('p4');
            }, 1000)
        })
        return p4;
    }).catch(err => {
        console.log('catch2', err);
    })

}