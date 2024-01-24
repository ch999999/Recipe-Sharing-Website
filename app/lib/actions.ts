'use server'

import {z} from 'zod'
import { createUser } from '../api/users'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { User } from './definitions'
import { signinUser } from '../api/users'
import { putTokenIntoCookie } from './auth'
import { deleteTokenFromCookie } from './auth'

export type State = {
    // error?:{
    //     username?: string;
    //     email?: string;
    //     firstname?:string;
    //     password?:string;
    // }
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
    const user = {
        username: formData.get('username'),
        email: formData.get('email'),
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        password: formData.get('password')
    } 

    const res = await createUser(user)

    //if res has key called errorField, that means validation error
    if(res.errorField){
        // if(res.errorField=="username"){
        //     return {
        //         error: {username: res.message},
        //         message:"Cursed"
        //     }
        // }else if(res.errorField=="email"){
        //     return {
        //         error: {email: res.message},
        //         message:"Cursed"
        //     }
        // }else if(res.errorField=="firstname"){
        //     return {
        //         error: {firstname: res.message},
        //         message:"Cursed"
        //     }
        // }else if(res.errorField=="password"){
        //     return {
        //         error: {password: res.message},
        //         message:"Cursed"
        //     }
        // }
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