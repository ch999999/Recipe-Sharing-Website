'use server'

import { createUser } from '../api/users'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signinUser } from '../api/users'
import { putTokenIntoCookie } from './auth'
import { deleteTokenFromCookie } from './auth'

export type State = {
    errorField?: string | null;
     message?: string | null;
}

export async function userLogin(prevState: State, formData:FormData){
    const loginCreds = {
        identifier: formData.get('identifier'),
        password: formData.get('password')
    }

    const loginRes  = await signinUser(loginCreds)

    if(loginRes.errorField){
        return{
            errorField: loginRes.errorField,
            message: loginRes.message       
        }
    }else{
        putTokenIntoCookie(loginRes.token)
        revalidatePath('/')
        redirect('/')
    }
}

export async function signoutUser(){
    deleteTokenFromCookie()
    revalidatePath('/')
    redirect('/')
}

export async function createNewUser(prevState: State, formData: FormData){
    if(formData.get('password')!==formData.get('password-confirmation')){
        return {
            errorField: "password-confirmation",
            message:"password and confirm-password do not match"
        }
    }
    const user = {
        username: formData.get('username'),
        email: formData.get('email'),
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        password: formData.get('password')
    } 

    const res = await createUser(user)

    //if response has property called errorField, that means validation error
    if(res.errorField){
        return{
            errorField:res.errorField,
            message:res.message
        } 
    }else{
        console.log("Created new user:"+JSON.stringify(res))
        const loginCreds = {identifier: user.username, password: user.password}
        const loginRes = await signinUser(loginCreds)

        if(loginRes.errorField){
            console.log("Error logging in: "+JSON.stringify(loginRes))
            redirect('/users/login')
        }else{
            putTokenIntoCookie(loginRes.token)
            revalidatePath('/')
            redirect('/')
        }
    }
}