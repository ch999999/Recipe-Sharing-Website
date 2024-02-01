'use client'
import { signoutUser } from "@/app/lib/actions"


export default function LogoutButton(){

    function logOut(){
        signoutUser()
    }

    return(
        <button onClick={logOut}>Log out</button>
    )

}