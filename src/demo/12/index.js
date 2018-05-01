import _Promise from './_promise';

// promise
// Promise.all()

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p1 = new P((resolve, reject) => {

        setTimeout(() => {
            // resolve('p1');
            reject('p1');
        }, 1000)

    })

    const p2 = new P((resolve, reject) => {

        setTimeout(() => {
            resolve('p2');
        }, 2000)

    })


    const p3 = P.all([p1, p2]);

    p3.then(res => {
        console.log('then', res);
    }).catch(err => {
        console.log('catch', err);
    })


}