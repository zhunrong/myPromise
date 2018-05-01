import _Promise from './_promise';

// promise
// finally

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p = new P((resolve, reject) => {

        resolve('p1');
        // reject('p1');
    })

    p.then(res => {
        console.log('then1', res);
    }).catch(err => {
        console.log('catch', err);
    }).finally(() => {
        console.log('finally');
    })


}