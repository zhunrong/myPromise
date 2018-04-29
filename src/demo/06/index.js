import _Promise from './_promise';

// promise
// catch函数可以捕获错误

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p = new P((resolve, reject) => {

        // resolve('p');
        throw new Error('test');

    })

    p.then(res => {
        console.log('then', res);
    }).catch(err => {
        console.log('catch', err);
    })



    console.log(p);

}