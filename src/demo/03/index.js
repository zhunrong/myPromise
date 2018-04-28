import _Promise from './_promise';

// promise的状态

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');


    const p = new P((resolve, reject) => {

        resolve();        
        reject();

    })

    p.then(() => {
        console.log('resolved');
    }).catch(() => {
        console.log('rejected');
    })

}