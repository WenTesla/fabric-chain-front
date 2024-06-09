import axios from "axios";
import {BasePath} from "~/api/base";

const path = "http://localhost:8080"

export interface RegisterData {
    id: string;
    password: string;
    email: string;
    //
    publickey: File
}

export interface LoginData {
    id: string;
    password: string;
}

export interface BaseResponse {
    status_code: number;
    status_msg: string;
    Data: any;
}

export interface UsersModel {
    certId: string;
    createTime: string;
    email: string;
    Id: string;
    isCA: number;
    lastLoginTime: string;
    password: string;
    publicKey: string;
    status: number;
    updateTime: string;
}

export interface Data {
    id: string
}

// 用户注册,生成密钥对
export function RegisterByGenRSA(data: RegisterData) {
    return axios.post<BaseResponse>(BasePath + '/user/registerByGenKey', data)
}

// 用户携带密钥
export function RegisterWithCert(data: RegisterData) {
    return axios.post<BaseResponse>(BasePath + '/user/registerWithKey', data)
}

// 用户登录
export function Login(data: LoginData) {
    return axios.post<BaseResponse>(BasePath + '/user/login', data)
}

// 用户数据
export function UserInfo() {
    return axios.post<UsersModel>(BasePath + '/user/allUser')
}

// 某一个用户的数据
export function User(data){
    return axios.post<UsersModel>(BasePath + '/user/info',data)
}

// 删除用户
export function DeleteUser(id: string) {
    let data = new FormData();
    data.append('id', id)
    return axios.post<BaseResponse>(BasePath + '/user/delete', data)
}

// 封禁用户
export function BanUser(data) {
    return axios.post<BaseResponse>(BasePath + '/user/ban', data)
}

// 解封用户
export function UnBanUser(data) {
    return axios.post<BaseResponse>(BasePath + '/user/unban', data)
}

export function UpdatePassword(data){
    return axios.post<BaseResponse>(BasePath + '/user/updatePassword', data)
}

export function UpgradeUser(data){
    return axios.post<BaseResponse>(BasePath + '/user/upgrade', data)

}

export function DegradeUser(data){
    return axios.post<BaseResponse>(BasePath + '/user/degrade', data)

}

export function UserRole(data){
    return axios.post<BaseResponse>(BasePath + '/user/role', data)
}