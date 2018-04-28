class _Promise {
    constructor(callback) {
        this.thenFunc = null;
        this.catchFunc = null;
        this.status = 'pending';
        callback(params => {
            setTimeout(() => {
                if (this.status != 'pending') return;
                this.status = 'resolved';
                this.thenFunc && this.thenFunc(params);
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
            this.thenFunc = suc;
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