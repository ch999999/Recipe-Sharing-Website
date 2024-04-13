'use server'
import { cookies } from "next/headers";
import { POSTAuthenticateToken, POSTRefreshTokens } from "../api/users";


export async function getTokenFromCookie(){
    const cookieStore = cookies()
    const token = cookieStore.get("token")
    if(token){
        return token.value.toString()
    }
    return null;
}

export async function getRefreshTokenFromCookie(){
    const cookieStore = cookies()
    const token = cookieStore.get("refresh-token")
    if(token){
        return token.value.toString()
    }
    return null;
}

export async function putTokenIntoCookie(token: any){
    cookies().set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
      })
}

export async function putRefreshTokenIntoCookie(refreshToken: any){
    cookies().set({
        name:'refresh-token',
        value: refreshToken,
        httpOnly: true,
        path: '/',
    })
}

export async function validateToken(){

    const tokenCheckResp = await POSTAuthenticateToken()
    if(tokenCheckResp.status===400){
        return {
            success: false,
            tryRefresh: false
        }
    }else if(tokenCheckResp.status===404){
        
        return {
            success:false,
            tryRefresh:true
        }
    }else if(tokenCheckResp.status===200){
        return {
            success:true,
            tryRefresh:false
        }
    }else{
        return {
            success:false,
            tryRefresh:false
        }
    }
}

export async function deleteTokenFromCookie(){
    cookies().delete("token")
}

export async function deleteRefreshTokenFromCookie(){
    cookies().delete("refresh-token")
}



