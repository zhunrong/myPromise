import _Promise from './_promise';

// promise
// 如果catch后面继续有then,会顺序执行

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const someAsyncThing = function () {
        return new P(function (resolve, reject) {
            // 下面一行会报错，因为x没有声明
            resolve(x + 2);
        });
    };

    someAsyncThing()
        .catch(function (error) {
            console.log('oh no', error);
        })
        .then(function () {
            console.log('carry on');
        });
    // oh no [ReferenceError: x is not defined]
    // carry on

}