import _Promise from './_promise';

// promise
// resolve函数参数是一个promise对象

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    

}