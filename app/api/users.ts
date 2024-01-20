import { getTokenFromLocalStorage } from "../lib/auth"

export const dynamic = 'force dynamic'

export async function checkToken(){
    const authResp = await fetch(
        process.env.BACKEND_BASE_URL+"/api/User/authcheck",{ //just checks if auth token is valid. To be converted to auth refresh in the future
            method:"POST",
            mode:"cors",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getTokenFromLocalStorage()
            }
        }
    )

    return authResp
}
