'use client'

import { userLogin } from "@/app/lib/actions";
import Link from "next/link";
import { useState } from "react";

export default function Form(){
    const initialState = {errorField:null, message:null}
    const [state, setState] = useState(initialState)
    const [isSubmitting, setIsSubmitting] = useState(false)

    function IdentifierError(){
        if(state!=null && state.errorField=="identifier"){
        return <div id="identifier-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">
                {state.message}
            </p>
        </div>
        }

        return <></>
    }

    function PasswordError(){
        if(state!=null && state.errorField=="password"){
        return <div id="password-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">
                {state.message}
            </p>
        </div>
        }
        return <></>
    }

    return (
        <>
        <div className="border border-t-0 rounded-md bg-gray-50 p-4 md:p-6 sm:max-w-[508px] lg:w-[55%] mx-auto">
            <p className="italic text-center">Sign in to continue creating and sharing recipes</p>
            <form action={async(e)=>{ setState(await userLogin(e)); setIsSubmitting(false)}}>
            <div className="form-control w-full">
            <label className="label" htmlFor="identifier">
                <span className="label-text">Username/Email</span>
            </label>
            <input
                type="text"
                name="identifier"
                placeholder=""
                className="input input-bordered w-full"
                aria-describedby="identifier-error"
                required
            />
            <IdentifierError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
            </label>
            <input
                type="password"
                name="password"
                placeholder=""
                className="input input-bordered w-full"
                aria-describedby="password-error"
                required
            />
            <PasswordError/>
        </div>

        <div className="form-control w-full mt-4">
            
        <button onClick={()=>setIsSubmitting(true)} className="btn btn-md">{isSubmitting ? (<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>):(<span>Login</span>)}</button>
            
        </div>
        </form>
        <p className="italic text-center mt-2">Don&apos;t have an account? Click <Link className=" underline text-blue-500" href="./signup">here</Link> to sign up</p>
        </div>
        </>
    )
}