import { validateToken } from "@/app/lib/auth"
import Link from "next/link"
import LogoutButton from "./logout-button"

export default async function MobileMenu(){

    const tokenValidationRes = await validateToken()

    if(tokenValidationRes.success){
    return<>
    <div className="fixed w-full min-h-screen bg-white z-[11]">
        <section className="p-2">
            <div className=" font-bold">Account</div>
            <LogoutButton/>
        </section>   
        <hr></hr>
        <section className="p-2">
            <div className="font-bold">Recipes</div>
            <Link href="/recipes/new">Create recipe</Link>
        </section>
        <section className="flex justify-center">
            <button className="btn outline outline-1 outline-gray-300">Close</button>
        </section>
    </div>
    </>
    }else{
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
}