import _Promise from './_promise';

// promise
// 没有使用catch方法捕获错误时，错误不会传递到外层，不会导致程序停止执行

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');


    const p = new P((resolve, reject) => {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    })

    p.then(res => {
        console.log("It's all right!");
    });

    setTimeout(() => { console.log(123) }, 2000);
    // Uncaught (in promise) ReferenceError: x is not defined
    // 123

}