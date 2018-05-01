import _Promise from './_promise';

// promise
// then catch 交替链式写法

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p1 = new P((resolve, reject) => {

        resolve('p1');
    })

    p1.then(res => {
        console.log('then1', res);

        return new P((resolve, reject) => {
            throw new Error('p1');

        })

    }).catch(err => {
        console.log('catch1', err);
        throw new Error('p2');
    }).then(res => {
        console.log('then2', res);
    }).catch(err => {
        console.log('catch2', err);
    })


}