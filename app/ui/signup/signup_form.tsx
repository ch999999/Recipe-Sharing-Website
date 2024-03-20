'use client'

import { useState } from "react";
import { createNewUser } from "@/app/lib/actions";
import Link from "next/link";


export default function Form(){
    const initialState = {errorField:null, message:null, stopSubmitting:false}
    
    const [state, setState] = useState(initialState)
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
    function PasswordConfirmationError(){
        if(state!=null && state.errorField=="password-confirmation"){
            
            return <div id="password-confirmation-error" aria-live="polite" aria-atomic="true">
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
            <p className="italic text-center">Sign up to start creating and sharing recipes</p>
            <form action= {async(e)=>{setState(await createNewUser(e)); setIsSubmitting(false) }}>
            <div className="form-control w-full">
            <label className="label" htmlFor="username">
                <span className="label-text">Username<span className="text-red-500">*</span></span>
                
            </label>
            <input
                type="text"
                name="username"
                placeholder="johndoe"
                className="input input-bordered w-full"
                aria-describedby="username-error"
                
            />
            <UsernameError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="email">
                <span className="label-text">Email<span className="text-red-500">*</span></span>
            </label>
            <input
                type="text"
                name="email"
                placeholder="john@example.com"
                className="input input-bordered w-full"
                aria-describedby="email-error"
                
            />
            <EmailError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="firstname">
                <span className="label-text">First name<span className="text-red-500">*</span></span>
            </label>
            <input
                type="text"
                name="firstname"
                placeholder="John"
                className="input input-bordered w-full"
                aria-describedby="firstname-error"
                
            />
            <FirstnameError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="lastname">
                <span className="label-text">Last name</span>
            </label>
            <input
                type="text"
                name="lastname"
                className="input input-bordered w-full"
            />
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="password">
                <span className="label-text">Password<span className="text-red-500">*</span></span>
            </label>
            <input
                type="password"
                name="password"
                placeholder=""
                className="input input-bordered w-full"
                aria-describedby="password-error"
                
            />
            <PasswordError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="password-confirmation">
                <span className="label-text">Confirm Password<span className="text-red-500">*</span></span>
            </label>
            <input
                type="password"
                name="password-confirmation"
                placeholder=""
                className="input input-bordered w-full"
                aria-describedby = "password-confirmation-error"
                
            />
            <PasswordConfirmationError/>
        </div>

        <div className="form-control w-full mt-4">
            
            <button onClick={()=>setIsSubmitting(true)} className="btn btn-md">{isSubmitting ? (<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>):(<span>Create Account</span>)}</button>
            
        </div>
        </form>
        <p className="italic text-center mt-2">Already have an account? Click <Link className=" underline text-blue-500" href="./login">here</Link> to sign in</p>
        </div>
        </>
    )
}