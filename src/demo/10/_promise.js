class _Promise {
    constructor(callback) {
        this.status = 'pending';
        this.funcArr = [];
        try {
            callback(params => {
                setTimeout(() => {
                    if (this.status != 'pending') return;

                    // result保存resolve传递的参数
                    let result = params;

                    for (let i = 0; i < this.funcArr.length; i++) {
                        const func = this.funcArr[i];
                        if (func.type === 'suc') {
                            result = func(result);
                            const _p = _Promise.resolve(result);
                            for (let j = i + 1; j < this.funcArr.length; j++) {
                                const func = this.funcArr[j];
                                if (func.type === 'suc') {
                                    _p.then(func);
                                } else {
                                    _p.catch(func);
                                }
                            }
                            break;
                        }
                    }
                }, 0)
            }, params => {
                setTimeout(() => {
                    if (this.status != 'pending') return;
                    this.status = 'rejected';
                    let result = params;
                    for (let i = 0; i < this.funcArr.length; i++) {
                        const func = this.funcArr[i];
                        if (func.type === 'fail') {
                            result = func(result);
                            const _p = _Promise.resolve(result);
                            for (let j = i + 1; j < this.funcArr.length; j++) {
                                const func = this.funcArr[j];
                                if (func.type === 'suc') {
                                    _p.then(func);
                                } else {
                                    _p.catch(func);
                                }
                            }
                            break;
                        }
                    }
                }, 0)
            })
        } catch (err) {
            setTimeout(() => {
                if (this.status != 'pending') return;
                this.status = 'rejected';
                let result = err;
                let hasCatch = false;

                for (let i = 0; i < this.funcArr.length; i++) {
                    const func = this.funcArr[i];
                    if (func.type === 'fail') {
                        result = func(result);
                        const _p = _Promise.resolve(result);
                        for (let j = i + 1; j < this.funcArr.length; j++) {
                            const func = this.funcArr[j];
                            if (func.type === 'suc') {
                                _p.then(func);
                            } else {
                                _p.catch(func);
                            }
                        }
                        hasCatch = true;
                        break;
                    }
                }

                if (!hasCatch) {
                    throw result;
                }

            }, 0)
        }

    }

    then(suc, fail) {
        if (typeof suc === 'function') {
            suc.type = 'suc';
            this.funcArr.push(suc);
        }
        if (typeof fail === 'function') {
            fail.type = 'fail';
            this.funcArr.push(fail);
        }

        return this;
    }

    catch(fail) {
        if (typeof fail === 'function') {
            fail.type = 'fail';
            this.funcArr.push(fail);
        }

        return this;
    }
}

_Promise.resolve = function (params) {
    if (params instanceof _Promise) {
        return params;
    } else {
        return new _Promise(resolve => {
            resolve(params);
        })
    }
}

_Promise.reject = function (params) {
    return new _Promise((resolve, reject) => {
        reject(params);
    })
}

export default _Promise