import { getTokenFromCookie } from "../lib/auth"
import { User } from "../lib/definitions"

export const dynamic = 'force dynamic'

export async function checkToken(){
    const token = await getTokenFromCookie()
    console.log("Bearer "+token)
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
    }

}
