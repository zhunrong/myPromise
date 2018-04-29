import _Promise from './_promise';

// promise
// then函数链式写法下产生的错误都会被catch捕获

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p = new P((resolve, reject) => {

        resolve('p1');
        // throw new Error('test');

    })

    p.then(res => {
        console.log('then', res);
        // throw new Error('p2');
        return 'p2';
    }).then(res => {
        console.log('then2', res);
        return new P((resolve, reject) => {

            throw new Error('p3');
            // reject('p3');            

        })
    }).catch(err => {
        console.log('catch', err);
    })



    console.log(p);

}