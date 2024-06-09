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

export function requestCert(data){
    return axios.post<BaseResponse>(BasePath+"/cert/registerCert",data)
}

export function LeafCertsInfo() {
    return axios.post<Certs>(BasePath+"/cert/allCert")
}

// 验证证书
export function VerityCert(data){
    return axios.post<BaseResponse>(BasePath+"/chain/verity",data)
}

// 批准
export function ApproveCert(data){
    return axios.post<BaseResponse>(BasePath+"/cert/approve",data)
}

export function RevokeCert(data){
    return axios.post<BaseResponse>(BasePath+"/cert/revoke",data)
}

export function DeleteCert(data){
    return axios.post<BaseResponse>(BasePath+"/cert/delete",data)
}

// 用户自己的cert
export function MyCert(data){
    return axios.post<Certs>(BasePath+"/cert/myCert",data)
}

// 下载
export function DownCert(data){
    return axios.post<BaseResponse>(BasePath+"/cert/myCert",data)
}

// 生成RSA密钥
export function GenRSA(data){
    return axios.post<BaseResponse>(BasePath+"/gen",data)
}