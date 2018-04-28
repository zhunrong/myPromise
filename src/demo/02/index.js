import _Promise from './_promise';

// promise一般用法

export default function (isNative) {
    const P = isNative ? Promise : _Promise;
    console.log(isNative ? 'Promise' : '_Promise');

    const p = new P((resolve, reject) => {
        setTimeout(() => {
            const random = Math.random();
            console.log('random=', random);

            if (random > 0.5) {
                resolve('>0.5');
            } else {
                reject('<=0.5');
            }

        }, 1000)
    })

    p.then(res => {
        console.log(res);
    }, err => {
        console.log(err);
    })
}