'use client'

import Link from "next/link"
import { Bars3Icon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { signoutUser } from "@/app/lib/actions"

export default function NavBar({isLoggedIn}:{isLoggedIn:boolean}){
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    function MobileMenu(){
        if(!isLoggedIn){
        return<>
        <div className="fixed w-full min-h-screen bg-white z-[11]">
            <section className="p-2">
                <div className=" font-bold">Account</div>
                <div className="flex flex-col">
                <Link href="/users/login" onClick={()=>setShowMobileMenu(false)}>Login</Link>
                <Link href="/users/signup" onClick={()=>setShowMobileMenu(false)}>Sign up</Link>
                </div>
            </section>   
            <hr></hr>
            <section className="p-2">
                <div className="font-bold">Recipes</div>
                <Link href="/users/signup" onClick={()=>setShowMobileMenu(false)}>Create recipe</Link>
            </section>
            <section className="flex justify-center">
                <button className="btn outline outline-1 outline-gray-300" onClick={()=>setShowMobileMenu(false)}>Close</button>
            </section>
        </div>
        </>
        }else{
            return<>
        <div className="fixed w-full min-h-screen bg-white z-[11]">
            <section className="p-2">
                <div className=" font-bold">Account</div>
                <div className="flex flex-col">
                <Link href='/users/profile' onClick={()=>setShowMobileMenu(false)}>View Profile</Link>
                <button className=" text-left" onClick={()=>{signoutUser(); setShowMobileMenu(false)}}>Log out</button>
                </div>
            </section>   
            <hr></hr>
            <section className="p-2">
                <div className="font-bold">Recipes</div>
                <div className="flex flex-col">
                <Link href="/recipes/new" onClick={()=>setShowMobileMenu(false)}>Create recipe</Link>
                <Link href="/recipes/user-recipes" onClick={()=>setShowMobileMenu(false)}>Your recipes</Link>
                </div>
            </section>
            <section className="flex justify-center">
                <button className="btn outline outline-1 outline-gray-300" onClick={()=>setShowMobileMenu(false)}>Close</button>
            </section>
        </div>
        </>
        }
    }

    function NavButtons(){
        if(!isLoggedIn){
            return(
                <>
                    <ul className="hidden menu menu-horizontal px-1 sm:inline"><li><Link href="/users/signup">Create Recipe</Link></li></ul>
                    <ul className="hidden menu menu-horizontal px-1 sm:inline"><li><Link href="/users/login">Log In</Link></li></ul>
                    <ul className="hidden menu menu-horizontal px-1 sm:inline"><li><Link href="/users/signup">Sign up</Link></li></ul>
                </>
            )
        }else{
            return(
                <>  <ul className="hidden menu menu-horizontal px-1 sm:inline"><li><Link href="/recipes/user-recipes">Your Recipes</Link></li></ul>
                    <ul className="hidden menu menu-horizontal px-1 sm:inline"><li><Link href="/recipes/new">Create Recipe</Link></li></ul>
                    <ul className="hidden menu menu-horizontal px-1 sm:inline"><li><Link href="/users/profile">Profile</Link></li></ul>
                    <ul className="hidden menu menu-horizontal px-1 sm:inline"><li><button onClick={()=>{signoutUser(); setShowMobileMenu(false)}}>Log out</button></li></ul>
                </>
            )
        }
    }

    return(
    <>
    <div className="navbar sticky top-0 bg-gray-100 z-10 print:hidden">
        <div className="flex-1">
            <Link href='/' className="btn btn-ghost normal-case text-xl" onClick={()=>setShowMobileMenu(false)}>{process.env.NEXT_PUBLIC_WEBSITE_NAME}</Link>
        </div>
        <div className="flex-none">
            <NavButtons></NavButtons>
            <ul className="menu menu-horizontal sm:hidden"><button onClick={()=>setShowMobileMenu(true)}><Bars3Icon className="w-9"></Bars3Icon></button></ul>
        </div>
    </div>
    {showMobileMenu && <MobileMenu></MobileMenu>}
    </>
    )
}