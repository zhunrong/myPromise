class _Promise {
    constructor(callback) {
        this.thenFuncArr = [];
        this.catchFunc = null;
        this.status = 'pending';

        try {
            callback(params => {
                setTimeout(() => {
                    if (this.status != 'pending') return;

                    // thenFuncArr 函数队列的索引指针
                    let funcIndex = 0;
                    // result保存resolve传递的参数
                    let result = params;

                    const _exective = () => {

                        //如果result是一个promise对象 将剩余的回调委托到result这个实例上
                        let curFunc = this.thenFuncArr[funcIndex];
                        if (result instanceof _Promise) {
                            while (curFunc) {
                                result.then(curFunc);
                                curFunc = this.thenFuncArr[++funcIndex];
                            }
                            result.catch(this.catchFunc);
                        } else {
                            this.status = 'resolved';
                            if (curFunc) {
                                try {
                                    result = curFunc(result);
                                    funcIndex++;
                                    _exective();
                                } catch (err) {
                                    this.catchFunc(err);
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
                    this.catchFunc && this.catchFunc(params);
                }, 0)
            })
        } catch (err) {
            setTimeout(() => {
                if (this.status != 'pending') return;
                this.status = 'rejected';
                // this.catchFunc ? this.catchFunc(err) : console.error(err);
                if (this.catchFunc) {
                    this.catchFunc(err);
                } else {
                    throw err;
                }
            }, 0)
        }

    }

    then(suc, fail) {
        if (typeof suc === 'function') {
            this.thenFuncArr.push(suc);
        }
        if (typeof fail === 'function') {
            this.catchFunc = fail;
        }

        return this;
    }

    catch(fail) {
        if (typeof fail === 'function') {
            this.catchFunc = fail;
        }

        return this;
    }
}

export default _Promise