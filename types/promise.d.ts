declare type OnFulfilled = (value: any) => any;
declare type OnRejected = (reason: any) => any;
declare type OnFinally = () => void;
declare type Resolve = (value?: any) => void;
declare type Reject = (reason?: any) => void;
declare type Executor = (resolve: Resolve, reject: Reject) => any;
export declare class Promise2 {
    state: 'pending' | 'fulfilled' | 'rejected';
    private __fulfilled__;
    private __rejected__;
    private __finally__;
    private __value__;
    constructor(exacutor: Executor);
    then(onFulfilled?: OnFulfilled, onRejected?: OnRejected): Promise2;
    catch(onRejected?: OnRejected): Promise2;
    finally(onFinally?: OnFinally): Promise2;
    static all(list: Promise2[]): Promise2;
    static race(list: Promise2[]): Promise2;
    static reject(value?: any): Promise2;
    static resolve(value?: any): Promise2;
}
export default Promise2;
