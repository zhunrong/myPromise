import _Promise from '../modules/promise';

// promise一般用法

function _promiseTest() {
    const p = new _Promise((resolve, reject) => {
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

function promiseTest() {
    const p = new Promise((resolve, reject) => {
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

export {
    _promiseTest,
    promiseTest
}