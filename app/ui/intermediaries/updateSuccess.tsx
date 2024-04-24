'use client'
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function UpdateSuccess(){
    //redirect("/")
    useEffect(()=>{alert("Your password was updated successfully."); redirect("/users/profile")},[])
    
    return<div></div>
}