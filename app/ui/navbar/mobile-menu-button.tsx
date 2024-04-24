'use client'
import { useState } from "react"
import Link from "next/link"

function MobileMenu(){
    return<>
    <div className="fixed w-full min-h-screen bg-white z-[11]">
        <section className="p-2">
            <div className=" font-bold">Account</div>
            <Link href="/users/login">Login</Link>
            <Link href="/users/signup">Sign up</Link>
        </section>   
        <hr></hr>
        <section className="p-2">
            <div className="font-bold">Recipes</div>
            <Link href="/users/signup">Create recipe</Link>
        </section>
        <section className="flex justify-center">
            <button className="btn outline outline-1 outline-gray-300">Close</button>
        </section>
    </div>
    </>
}

export default function MobileMenuButton(){
    const [showMe, setShowMe] = useState(false)
    return (
    <><button onClick={()=>setShowMe(true)}>SHOW ME</button>
    {showMe && <MobileMenu/>}
    </>
    )
}