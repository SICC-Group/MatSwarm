export enum AcceptanceState {
    //验收中（可以分配专家）
    Dispatching = 0, //待分配验收专家
    Expert_Evaluating = 1, //专家评价中
    Leader_Evaluating = 2, //评价组长评价中
    //验收结束
    Signature_Pending = 3, //通过验收，等待上传签名的报告
    Failed = 4, //不通过
    Finished = 5, //完成验收
}