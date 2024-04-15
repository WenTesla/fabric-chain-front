import axios from "axios";
import {BasePath, BaseResponse} from "~/api/base";
export interface Certs {
    certId: string;
    version: number;
    beginDate: Date;
    endDate: Date;
    subject: any; // 可能需要根据实际情况调整类型定义
    issuer: any;  // 可能需要根据实际情况调整类型定义
    certBytes: ArrayBuffer; // 通常前端使用 ArrayBuffer 来表示二进制数据
    certHashValue: string;
    userId: string;
}

// 全部cert信息
export function CertsInfo() {
    return axios.post<Certs>(BasePath+"/chain/all")
}
// 创建csr
export function CreateCsr(data) {
    return axios.post<BaseResponse>(BasePath+"/cert/csr",data)
}
export function registerIntermediateCert(data) {
    return axios.post<BaseResponse>(BasePath+"/cert/registerIntermediateCert",data)
}



