class _Promise {
  constructor(callback) {
    this.thenFuncArr = [];
    this.catchFuncArr = [];
    this.status = 'pending';
    callback(
      res => {
        setTimeout(() => {
          if (this.status != 'pending') return;
          let result = res;
          let funcIndex = 0;


          const _exective = () => {
            if (funcIndex === this.thenFuncArr.length) return;
            result = this.thenFuncArr[funcIndex++](result);
            if (result instanceof _Promise) {
              result.then(res => {
                result = res;
                _exective();
              })
            } else {
              _exective();
            }
          }
          _exective();
          this.status = 'resolved';
        }, 0)
      },
      err => {
        setTimeout(() => {
          if (this.status != 'pending') return;
          this.catchFuncArr.forEach(callback => {
            callback(err);
          });
          this.status = 'rejected';
        }, 0)
      }
    );
  }

  /**
   * 设置回调函数
   * @param {Function} suc 
   * @param {Function} fail 
   */
  then(suc, fail) {

    if (typeof suc === 'function') {
      this.thenFuncArr.push(suc);
    }
    if (typeof fail === 'function') {
      this.catchFuncArr.push(fail);
    }
    return this;
  }
  catch (callback) {
    this.catchFuncArr.push(callback);
    return this;
  }
}


export default _Promise
