type OnFulfilled = (value: any) => any
type OnRejected = (reason: any) => any
type OnFinally = () => void
type Resolve = (value?: any) => void
type Reject = (reason?: any) => void
type Executor = (resolve: Resolve, reject: Reject) => any
type FulfillObj = {
  onFulfilled?: OnFulfilled,
  resolve: Resolve,
  reject: Reject
}
type RejectObj = {
  onRejected?: OnRejected,
  resolve: Resolve,
  reject: Reject
}
type FinallyObj = {
  onFinally?: OnFinally,
  resolve: Resolve,
  reject: Reject
}

export class Promise2 {
  state: 'pending' | 'fulfilled' | 'rejected' = 'pending'
  private __fulfilled__: FulfillObj[] = []
  private __rejected__: RejectObj[] = []
  private __finally__: FinallyObj[] = []
  private __value__: any = null

  constructor(exacutor: Executor) {
    const resolve: Resolve = value => {
      if (value && typeof value.then === 'function') {
        value.then(resolve, reject)
      } else {
        if (this.state !== 'pending') return
        this.state = 'fulfilled'
        this.__value__ = value
        setTimeout(() => {
          this.__fulfilled__.forEach(obj => {
            if (typeof obj.onFulfilled === 'function') {
              try {
                const result = obj.onFulfilled(value)
                if (result && typeof result.then === 'function') {
                  result.then(obj.resolve, obj.reject)
                } else {
                  obj.resolve(result)
                }
              } catch (error) {
                obj.reject(error)
              }
            } else {
              obj.resolve(value)
            }
          })
          callFinally()
        }, 0)
      }

    }
    const reject: Reject = reason => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.__value__ = reason
      setTimeout(() => {
        this.__rejected__.forEach(obj => {
          if (typeof obj.onRejected === 'function') {
            try {
              const result = obj.onRejected(reason)
              if (result && typeof result.then === 'function') {
                result.then(obj.resolve, obj.reject)
              } else {
                obj.resolve(result)
              }
            } catch (error) {
              obj.reject(error)
            }
          } else {
            obj.reject(reason)
          }
        })
        callFinally()
      }, 0)
    }
    const callFinally = () => {
      this.__finally__.forEach(obj => {
        if (typeof obj.onFinally === 'function') {
          obj.onFinally()
        }
        if (this.state === 'fulfilled') {
          obj.resolve(this.__value__)
        } else {
          obj.reject(this.__value__)
        }
      })
    }
    try {
      exacutor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled?: OnFulfilled, onRejected?: OnRejected) {
    return new Promise2((resolve, reject) => {
      this.__fulfilled__.push({
        onFulfilled,
        resolve,
        reject
      })
      this.__rejected__.push({
        onRejected,
        resolve,
        reject
      })
    })
  }

  catch(onRejected?: OnRejected) {
    return new Promise2((resolve, reject) => {
      this.__rejected__.push({
        onRejected,
        resolve,
        reject
      })
    })
  }

  finally(onFinally?: OnFinally) {
    return new Promise2((resolve, reject) => {
      this.__finally__.push({
        onFinally,
        resolve,
        reject
      })
    })
  }

  static all(list: Promise2[]) {
    const results: any[] = []
    return new Promise2((resolve, reject) => {
      list.forEach(p => {
        p.then(
          value => {
            results.push(value)
            if (results.length === list.length) {
              resolve(results)
            }
          }, reason => {
            reject(reason)
          })
      })
    })
  }

  static race(list: Promise2[]) {
    return new Promise2((resolve, reject) => {
      list.forEach(p => {
        p.then(
          value => {
            resolve(value)
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }

  static reject(value?: any) {
    return new Promise2((resolve, reject) => {
      reject(value)
    })
  }

  static resolve(value?: any) {
    return new Promise2((resolve, reject) => {
      if (value && typeof value.then === 'function') {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }
}

export default Promise2