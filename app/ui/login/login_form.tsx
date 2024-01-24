'use client'

import { useFormState } from "react-dom"
import { userLogin } from "@/app/lib/actions";

export default function Form(){
    const initialState = {errorField:null, message:null}
    const [state, dispatch] = useFormState(userLogin, initialState)

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
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
            <form action={dispatch}>
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
            
            <button className="btn btn-md">Login</button>
            
        </div>
            </form>
            </div>
        </>
    )
}