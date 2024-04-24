'use client'

import { useState } from "react";
import { updateUserDetails } from "@/app/lib/actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { User } from "@/app/lib/definitions";
import { EyeIcon } from "@heroicons/react/24/outline";
import {EyeSlashIcon} from "@heroicons/react/24/outline";

function SubmitButton(){
    const status = useFormStatus()
    return <button className="btn btn-md">{status.pending ? (<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>):(<span>Update</span>)}</button>  
}


export default function Form({user}:{user:User}){
    const initialState = {errorField:null, message:null}
    
    const [state, setState] = useState(initialState)
    const [passwordFieldType, setPasswordFieldType] = useState("password")
    function UsernameError(){
        if(state!=null && state.errorField=="username"){
        return <div id="username-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">
                {state.message}
            </p>
        </div>
        }

        return null
    }

    function EmailError(){
        if(state!=null && state.errorField=="email"){
        return <div id="email-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">
                {state.message}
            </p>
        </div>
        }
        return null
    }

    function FirstnameError(){
        if(state!=null && state.errorField=="firstname"){
        return <div id="firstname-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">
                {state.message}
            </p>
        </div>
        }
        return null
    }

    function PasswordError(){
        if(state!=null && state.errorField=="password"){
        return <div id="password-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">
                {state.message}
            </p>
        </div>
        }
        return null
    }
    

    const [isSubmitting, setIsSubmitting] = useState(false)

    
    return (
        
        <>
        
        <div className="border border-t-0 rounded-md bg-gray-50 p-4 md:p-6 sm:max-w-[508px] lg:w-[55%] mx-auto">
            <p className="font-bold text-xl text-center">Change Account Details</p>
            <p className="italic text-center">Edit the values you want to change</p>
            <form action= {async(e)=>{const newState=await updateUserDetails(e); setState(newState);}}>
            <div className="form-control w-full">
            <label className="label" htmlFor="username">
                <span className="label-text">Your New Username<span className="text-red-500">*</span></span>
                
            </label>
            <input
                type="text"
                id="username"
                name="username"
                placeholder={user.username}
                className="input input-bordered w-full"
                aria-describedby="username-error"
                defaultValue={user.username}
            />
            <UsernameError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="email">
                <span className="label-text">Your New Email<span className="text-red-500">*</span></span>
            </label>
            <input
                type="text"
                id="email"
                name="email"
                placeholder={user.email}
                className="input input-bordered w-full"
                aria-describedby="email-error"
                defaultValue={user.email}
            />
            <EmailError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="firstname">
                <span className="label-text">Your New First name<span className="text-red-500">*</span></span>
            </label>
            <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder={user.firstname}
                className="input input-bordered w-full"
                aria-describedby="firstname-error"
                defaultValue={user.firstname}
            />
            <FirstnameError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="lastname">
                <span className="label-text">Your New Last Name</span>
            </label>
            <input
                type="text"
                id="lastname"
                name="lastname"
                className="input input-bordered w-full"
                placeholder={!user.lastname||user.lastname===null ? "" : user.lastname}
                defaultValue={!user.lastname||user.lastname===null ? "" : user.lastname}
            />
        </div>

        <div className="form-control w-full mt-10">
            <label className="label" htmlFor="password">
                <span className="label-text">Your Current Password (required for authentication)<span className="text-red-500">*</span></span>
            </label>
            <div className="flex flex-row">
            <input
                type={passwordFieldType}
                id="password"
                name="password"   
                placeholder=""
                className="input input-bordered w-full mr-2"
                aria-describedby="password-error"
                
            />
            {passwordFieldType==="password" ? <button type="button" onClick={()=>setPasswordFieldType("text")}><EyeIcon className=" w-6"></EyeIcon></button> : <button type="button" onClick={()=>setPasswordFieldType("password")}><EyeSlashIcon className="w-6"></EyeSlashIcon></button>}
            </div>
            <PasswordError/>
        </div>

        <div className="form-control w-full mt-4">
            <SubmitButton></SubmitButton>
        </div>
        </form>
       
        </div>
        </>
    )
}