import { deleteRefreshTokenFromCookie, deleteTokenFromCookie, getRefreshTokenFromCookie, getTokenFromCookie, putRefreshTokenIntoCookie, putTokenIntoCookie } from "../lib/auth"
import { User } from "../lib/definitions"

export const dynamic = 'force dynamic'

export async function refreshToken(){
    const token = await getTokenFromCookie()
    const refreshTokenn = await getRefreshTokenFromCookie()
    if(!token || token==="" || !refreshTokenn || refreshTokenn===""){
        return {
            error: "relog"
        }
    }
    const tokens = {
        AccessToken: token,
        RefreshToken: refreshTokenn
    }
    const authRefreshResp = await fetch(
        process.env.BACKEND_BASE_URL+"/api/User/auth-refresh",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tokens)
        }
    )
    if(authRefreshResp.status===200){
        const res = await authRefreshResp.json()
        putTokenIntoCookie(res.accessToken)
        putRefreshTokenIntoCookie(res.refreshToken)
        return res
    }else{
        deleteTokenFromCookie()
        deleteRefreshTokenFromCookie()
        return {error: "relog"}
    }
    
}

export async function checkToken(){
    
    const token = await getTokenFromCookie()
    const refreshToken = await getRefreshTokenFromCookie()
    if(!token || token==="" || !refreshToken || refreshToken===""){
        return {
            error: "relog"
        }
    }
    const authResp = await fetch(
        process.env.BACKEND_BASE_URL+"/api/User/authcheck",{
            method:"POST",
            mode:"cors",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }
    )
    
    return authResp
}

export async function createUser(user: {username: FormDataEntryValue | null, email: FormDataEntryValue | null, password:FormDataEntryValue | null}){
    
    try{
    const resp = await fetch(
        process.env.BACKEND_BASE_URL+"/api/User",{
            method: "POST",
            mode:"cors",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    )

    const res = await resp.json()
    return res
    }catch(error){
        return {errorField:"password", message: "Unknown error occured. Try again later"}
    }
}

export async function signinUser(user: any){
    try{
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/User/login2",{
                method:"POST",
                mode:"cors",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(user)
            }
        )

        const res = await resp.json()
        return res
    }catch(error){
        console.log("Error logging in: "+error)
        return{errorField:"password", message:"Unknown error occured. Try again later"}
    }

}

export async function signUserOut(){
    const tokens = {
        AccessToken: await getTokenFromCookie(),
        RefreshToken: await getRefreshTokenFromCookie()
    }
    console.log(tokens)
    try{
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/User/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(tokens)
            }
        )
        const res = await resp.json()
        console.log(res)
    }catch{

    }
}
