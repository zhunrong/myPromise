class _Promise {
    constructor(callback) {
        this.thenFuncArr = [];
        this.catchFuncArr = [];
        this.status = 'pending';
        this.catchFuncIndex = 0;
        this.thenFuncIndex = 0;

        try {
            callback(params => {
                setTimeout(() => {
                    if (this.status != 'pending') return;

                    // result保存resolve传递的参数
                    let result = params;

                    const _exective = () => {

                        //如果result是一个promise对象 将剩余的回调委托到result这个实例上
                        let curThenFunc = this.thenFuncArr[this.thenFuncIndex];
                        let curCatchFunc = this.catchFuncArr[this.catchFuncIndex];
                        if (result instanceof _Promise) {
                            while (curThenFunc) {
                                result.then(curThenFunc);
                                curThenFunc = this.thenFuncArr[++this.thenFuncIndex];
                            }
                            result.catch(this.catchFunc);
                            while (curCatchFunc) {
                                result.catch(curCatchFunc);
                                curCatchFunc = this.catchFuncArr[++this.catchFuncIndex];
                            }
                        } else {
                            this.status = 'resolved';
                            if (curThenFunc) {
                                try {
                                    result = curThenFunc(result);
                                    this.thenFuncIndex++;
                                    _exective();
                                } catch (err) {
                                    const _exective = error => {
                                        if (this.catchFuncArr[this.catchFuncIndex]) {
                                            try {
                                                this.catchFuncArr[this.catchFuncIndex](error);
                                            } catch (err) {
                                                this.catchFuncIndex++;
                                                _exective(err);
                                            }
                                        } else {
                                            throw error;
                                        }
                                    }
                                    _exective(err);
                                }

                            }
                        }
                    }

                    _exective();

                }, 0)
            }, params => {
                setTimeout(() => {
                    if (this.status != 'pending') return;
                    this.status = 'rejected';
                    const _exective = error => {
                        if (this.catchFuncArr[this.catchFuncIndex]) {
                            try {
                                this.catchFuncArr[this.catchFuncIndex](error);
                            } catch (err) {
                                this.catchFuncIndex++;
                                _exective(err);
                            }
                        } else {
                            throw error;
                        }
                    }
                    _exective(params);
                }, 0)
            })
        } catch (err) {
            setTimeout(() => {
                if (this.status != 'pending') return;
                this.status = 'rejected';

                const _exective = error => {
                    if (this.catchFuncArr[this.catchFuncIndex]) {
                        try {
                            this.catchFuncArr[this.catchFuncIndex](error);
                        } catch (err) {
                            this.catchFuncIndex++;
                            _exective(err);
                        }
                    } else {
                        throw error;
                    }
                }
                _exective(err);
            }, 0)
        }

    }

    then(suc, fail) {
        if (typeof suc === 'function') {
            this.thenFuncArr.push(suc);
        }
        if (typeof fail === 'function') {
            this.catchFuncArr.push(fail);
        }

        return this;
    }

    catch(fail) {
        if (typeof fail === 'function') {
            this.catchFuncArr.push(fail);
        }

        return this;
    }
}

export default _Promise