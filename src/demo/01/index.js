import _Promise from './_promise';

//promise 执行顺序

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');


    const p = new P((resolve, reject) => {
        console.log('Promise');
        resolve();
    })

    p.then(() => {
        console.log('resolved');
    })

    console.log('hello');
}