class _Promise {
    constructor(callback) {
        this.thenFuncArr = [];
        this.catchFunc = null;
        this.status = 'pending';
        callback(params => {
            setTimeout(() => {
                if (this.status != 'pending') return;

                //thenFuncArr函数队列的索引指针
                let funcIndex = 0;
                //result保存resolve传递的参数
                let result = params;

                const _exective = () => {
                    if (!this.thenFuncArr[funcIndex]) return;
                    //如果params是一个promise对象
                    if (result instanceof _Promise) {
                        result.then(res => {
                            this.status = 'resolved';
                            result = this.thenFuncArr[funcIndex](res);
                            funcIndex++;
                            _exective();
                        }).catch(err => {
                            this.status = 'rejected';
                            this.catchFunc && this.catchFunc(err);
                        })
                    } else {
                        this.status = 'resolved';
                        result = this.thenFuncArr[funcIndex](result);
                        funcIndex++;
                        _exective();
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

    catch (fail) {
        if (typeof fail === 'function') {
            this.catchFunc = fail;
        }

        return this;
    }
}

export default _Promise