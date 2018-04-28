import _Promise from '../modules/promise';

// promise的状态

export default function (isNative) {
    const P = isNative ? Promise : _Promise;


}