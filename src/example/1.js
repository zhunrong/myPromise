import _Promise from '../modules/promise';

function _promiseTest() {
    const p = new _Promise((resolve, reject) => {
        console.log("promise");
        setTimeout(() => {
            resolve(1);
        }, 1000);
    });

    p
        .then(res => {
            console.log(1, res);

            return new _Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("p2");
                }, 1000);
            });
        })
        .then(res => {
            console.log(2, res);
            return new _Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("p3");
                }, 1000);
            });
        })
        .then(res => {
            console.log(3, res);
        });

    console.log(p);
}


function promiseTest() {
    const p = new Promise((resolve, reject) => {
        console.log("promise");
        setTimeout(() => {
            resolve(1);
        }, 1000);
    });

    p
        .then(res => {
            console.log(1, res);

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("p2");
                }, 1000);
            });
        })
        .then(res => {
            console.log(2, res);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("p3");
                }, 1000);
            });
        })
        .then(res => {
            console.log(3, res);
        });

    console.log(p);
}


export {
    _promiseTest,
    promiseTest
}