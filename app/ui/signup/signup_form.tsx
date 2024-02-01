'use client'

import { useFormState } from "react-dom"
import { createNewUser } from "@/app/lib/actions";

export default function Form(){
    const initialState = {errorField:null, message:null}
    const [state, dispatch] = useFormState(createNewUser, initialState)

    function UsernameError(){
        if(state!=null && state.errorField=="username"){
        return <div id="username-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">
                {state.message}
            </p>
        </div>
        }

        return <></>
    }

    function EmailError(){
        if(state!=null && state.errorField=="email"){
        return <div id="email-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">
                {state.message}
            </p>
        </div>
        }
        return <></>
    }

    function FirstnameError(){
        if(state!=null && state.errorField=="firstname"){
        return <div id="firstname-error" aria-live="polite" aria-atomic="true">
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

    function PasswordConfirmationError(){
        if(state!=null && state.errorField=="password-confirmation"){
            return <div id="password-confirmation-error" aria-live="polite" aria-atomic="true">
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
            <label className="label" htmlFor="username">
                <span className="label-text">Username</span>
            </label>
            <input
                type="text"
                name="username"
                placeholder="johndoe"
                className="input input-bordered w-full"
                aria-describedby="username-error"
                required
            />
            <UsernameError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
            </label>
            <input
                type="email"
                name="email"
                placeholder="john@example.com"
                className="input input-bordered w-full"
                aria-describedby="email-error"
                required
            />
            <EmailError/>
        </div>

        <div className="form-control w-full">
            <label className="label" htmlFor="firstname">
                <span className="label-text">First name</span>
            </label>
            <input
                type="text"
                name="firstname"
                placeholder="John"
                className="input input-bordered w-full"
                aria-describedby="firstname-error"
                required
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

        <div className="form-control w-full">
            <label className="label" htmlFor="password-confirmation">
                <span className="label-text">Confirm Password</span>
            </label>
            <input
                type="password"
                name="password-confirmation"
                placeholder=""
                className="input input-bordered w-full"
                aria-describedby = "password-confirmation-error"
                required
            />
            <PasswordConfirmationError/>
        </div>

        <div className="form-control w-full mt-4">
            
            <button className="btn btn-md">Create an Account</button>
            
        </div>
            </form>
            </div>
        </>
    )
}