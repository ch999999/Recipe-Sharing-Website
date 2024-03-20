import { getRefreshTokenFromCookie, getTokenFromCookie } from "../lib/auth"
import { User } from "../lib/definitions"

export const dynamic = 'force dynamic'

export async function checkToken(){
    const token = await getTokenFromCookie()
    const authResp = await fetch(
        process.env.BACKEND_BASE_URL+"/api/User/authcheck",{ //just checks if auth token is valid. To be converted to auth refresh in the future
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
