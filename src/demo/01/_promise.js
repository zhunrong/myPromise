class _Promise {
    constructor(callback) {
        this.thenFunc = null;
        this.catchFunc = null;

        callback(() => {
            setTimeout(() => {
                this.thenFunc && this.thenFunc();
            }, 0)
        }, () => {
            setTimeout(() => {
                this.catchFunc && this.catchFunc();
            }, 0)
        })
    }

    then(suc) {
        if (typeof suc === 'function') {
            this.thenFunc = suc;
        }
    }

    catch (fail) {
        if (typeof fail === 'function') {
            this.catchFunc = fail;
        }
    }
}

export default _Promise