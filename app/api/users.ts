import { deleteRefreshTokenFromCookie, deleteTokenFromCookie, getRefreshTokenFromCookie, getTokenFromCookie, putRefreshTokenIntoCookie, putTokenIntoCookie } from "../lib/auth"
import { Login, User } from "../lib/definitions"

export const dynamic = 'force dynamic'

//res represents JSON body content or custom JSON, resp represents the entire HTTP response 
export async function POSTRefreshTokens(){ //formerly refreshToken()
    const currentAccessToken = await getTokenFromCookie()
    const currentRefreshToken = await getRefreshTokenFromCookie()
    if(!currentAccessToken || currentAccessToken==="" || !currentRefreshToken || currentRefreshToken===""){
        return {
            error: "relog"
        }
    }
    const tokens = {
        AccessToken: currentAccessToken,
        RefreshToken: currentRefreshToken
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

export async function POSTAuthenticateToken(){ //formerly checkToken()
    
    const accessToken = await getTokenFromCookie()
    const refreshToken = await getRefreshTokenFromCookie()
    if(!accessToken || accessToken==="" || !refreshToken || refreshToken===""){
        return {
            status: 400
        }
    }
    const authResp = await fetch(
        process.env.BACKEND_BASE_URL+"/api/User/authcheck",{
            method:"POST",
            mode:"cors",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        }
    )
    
    return authResp
}

export async function POSTCreateNewUser(user:User){ //formerly createUser(user:User)
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
    console.log("resp: "+JSON.stringify(resp))
    const res = await resp.json()
    //console.log("res: "+res)
    return res
    }catch(error){
        console.log(error)
        return {errorField:"password", message: "Unknown error occured. Try again later"}
    }
}

export async function POSTSigninUser(user:Login){
    try{
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/User/login",{
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

export async function POSTSignoutUser(){ //formerly signUserOut()
    const tokens = {
        AccessToken: await getTokenFromCookie(),
        RefreshToken: await getRefreshTokenFromCookie()
    }
    
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
        
    }catch{

    }
}

export async function GETUserDetails(){
    try{
        const token = await getTokenFromCookie()
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/User/profile",{
                method: "GET",
                headers:{
                
                    "Authorization": "Bearer "+token
                }
            }
        )
        return resp
    }catch(error){
        console.log(error)
    }
}

export async function PATCHUserDetails(user:User){
    try{
        const token = await getTokenFromCookie()
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/User/profile/update",{
                method: "PATCH",
                headers:{
                    "Authorization": "Bearer "+token,
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(user)
            }
        )
        const res = await resp.json()
        return res
    }catch(error){
        console.log(error)
    }
}

export async function PATCHUserPassword(passwords:string[]){
    try{
        const token = await getTokenFromCookie()
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/User/profile/update-password",{
                method: "PATCH",
                headers:{
                    "Authorization": "Bearer "+token,
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(passwords)
            }
        )
        const res = await resp.json()
        return res
    }catch(error){
        console.log(error)
    }
}
