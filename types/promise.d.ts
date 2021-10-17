declare const STATE: unique symbol;
declare const CALLBACKS: unique symbol;
declare const RESULT: unique symbol;
declare type Resolve = (value?: any) => void;
declare type Reject = (reason?: any) => void;
declare type Executor = (resolve: Resolve, reject: Reject) => void;
declare type OnFulfilled = (value: any) => any;
declare type OnRejected = (reason: any) => any;
declare type Callback = {
    onFulfilled?: OnFulfilled;
    onRejected?: OnRejected;
    resolve: Resolve;
    reject: Reject;
};
export declare class MyPromise {
    static reject(reason: any): MyPromise;
    static resolve(value: any): MyPromise;
    static all(promises: MyPromise[]): MyPromise;
    static race(promises: MyPromise[]): MyPromise;
    [STATE]: "pending" | "fulfilled" | "rejected";
    [RESULT]: any;
    [CALLBACKS]: Callback[];
    constructor(executor: Executor);
    then(onFulfilled?: OnFulfilled, onRejected?: OnRejected): MyPromise;
    catch(onRejected: OnRejected): MyPromise;
}
export default MyPromise;
