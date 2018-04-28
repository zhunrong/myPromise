class _Promise {
    constructor(callback) {
        this.thenFunc = null;
        this.catchFunc = null;
        callback(params => {
            setTimeout(() => {
                this.thenFunc && this.thenFunc(params);
            }, 0)
        }, params => {
            setTimeout(() => {
                this.catchFunc && this.catchFunc(params);
            }, 0)
        })
    }

    then(suc, fail) {
        if (typeof suc === 'function') {
            this.thenFunc = suc;
        }
        if (typeof fail === 'function') {
            this.catchFunc = fail;
        }
    }

    catch (fail) {
        if (typeof fail === 'function') {
            this.catchFunc = fail;
        }
    }
}

export default _Promise