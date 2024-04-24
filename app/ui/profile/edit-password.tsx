'use client'

import { useState } from "react";
import { updateUserPassword } from "@/app/lib/actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { User } from "@/app/lib/definitions";
import { EyeIcon } from "@heroicons/react/24/outline";
import {EyeSlashIcon} from "@heroicons/react/24/outline";

function SubmitButton(){
    const status = useFormStatus()
    return <button className="btn btn-md">{status.pending ? (<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>):(<span>Change Password</span>)}</button>  
}


export default function Form({user}:{user:User}){
    const initialState = {errorField:null, message:null}
    
    const [state, setState] = useState(initialState)
    const [currentPasswordFieldType, setCurrentPasswordFieldType] = useState("password")
    const [newPasswordFieldType, setNewPasswordFieldType] = useState("password")
    const [confirmNewPasswordFieldType, setConfirmNewPasswordFieldType] = useState("password")

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

    function NewPasswordError(){
        if(state!=null && state.errorField=="new-password"){
            
            return <div id="new-password-error" aria-live="polite" aria-atomic="true">
                <p className="mt-2 text-sm text-red-500">
                    {state.message}
                </p>
            </div>
            }
            return null
    }

    function NewPasswordConfirmationError(){
        if(state!=null && state.errorField=="new-password-confirmation"){
            
            return <div id="new-password-confirmation-error" aria-live="polite" aria-atomic="true">
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
            <p className="font-bold text-xl text-center">Change Password</p>
            <p className="mt-2">Currently signed in as: <span className="font-bold">{user.username}</span></p>
            <form action= {async(e)=>{const newState=await updateUserPassword(e); setState(newState);}}>
            

        <div className="form-control w-full">
            <label className="label" htmlFor="password">
                <span className="label-text">Your Current Password<span className="text-red-500">*</span></span>
            </label>
            <div className="flex flex-row">
            <input
                type={currentPasswordFieldType}
                id="password"
                name="password"
                placeholder=""
                className="input input-bordered w-full mr-2"
                aria-describedby="password-error"
                
            />
            {currentPasswordFieldType==="password" ? <button type="button" onClick={()=>setCurrentPasswordFieldType("text")}><EyeIcon className=" w-6"></EyeIcon></button> : <button type="button" onClick={()=>setCurrentPasswordFieldType("password")}><EyeSlashIcon className="w-6"></EyeSlashIcon></button>}
            </div>
            <PasswordError/>
        </div>

        <div className="form-control w-full mt-8">
            <label className="label" htmlFor="new-password">
                <span className="label-text">Your New Password<span className="text-red-500">*</span></span>
            </label>
            <div className="flex flex-row">
            <input
                id="new-password"
                type={newPasswordFieldType}
                name="new-password"
                placeholder=""
                className="input input-bordered w-full mr-2"
                aria-describedby="new-password-error"
                
            />
            {newPasswordFieldType==="password" ? <button type="button" onClick={()=>setNewPasswordFieldType("text")}><EyeIcon className=" w-6"></EyeIcon></button> : <button type="button" onClick={()=>setNewPasswordFieldType("password")}><EyeSlashIcon className="w-6"></EyeSlashIcon></button>}
            </div>
            <NewPasswordError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="new-password-confirmation">
                <span className="label-text">Confirm New Password<span className="text-red-500">*</span></span>
            </label>
            <div className="flex flex-row">
            <input
                id="new-password-confirmation"
                type={confirmNewPasswordFieldType}
                name="new-password-confirmation"
                placeholder=""
                className="input input-bordered w-full mr-2"
                aria-describedby="new-password-confirmation-error"
                
            />
            {confirmNewPasswordFieldType==="password" ? <button type="button" onClick={()=>setConfirmNewPasswordFieldType("text")}><EyeIcon className=" w-6"></EyeIcon></button> : <button type="button" onClick={()=>setConfirmNewPasswordFieldType("password")}><EyeSlashIcon className="w-6"></EyeSlashIcon></button>}
            </div>
            <NewPasswordConfirmationError/>
        </div>

        <div className="form-control w-full mt-4">
            <SubmitButton></SubmitButton>
        </div>
        </form>
       
        </div>
        </>
    )
}