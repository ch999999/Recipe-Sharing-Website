import { checkToken } from "../api/users";

export function getTokenFromLocalStorage(){
    const auth = localStorage.getItem("auth")
    if(auth){
        return JSON.parse(auth)["token"]
    }
    return null;
}

export async function validateToken(){
    if(!getTokenFromLocalStorage){
        return true;
    }

    const tokenValidity = await checkToken()

    if(tokenValidity.status === 200){
        return false;
    }
    return true
}



