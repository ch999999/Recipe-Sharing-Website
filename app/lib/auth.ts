'use server'
import { cookies } from "next/headers";
import { checkToken } from "../api/users";

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

    if(await getTokenFromCookie()==null){
        return false;
    }

    const tokenValidity = await checkToken()

    if(tokenValidity.status === 200){
        return true;
    }
    return false;
}

export async function deleteTokenFromCookie(){
    console.log("Deleted token from cookie")
    cookies().delete("token")
}

export async function deleteRefreshTokenFromCookie(){
    console.log("Deleted refresh token from cookie")
    cookies().delete("refresh-token")
}



