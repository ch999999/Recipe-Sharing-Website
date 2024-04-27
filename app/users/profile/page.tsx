import UserProfile from "@/app/ui/profile/user-profile";
import { validateToken } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import RefreshRetry from "@/app/ui/intermediaries/refreshRetry";
import { GETUserDetails } from "@/app/api/users";
import { Suspense } from "react";
import Loading from "@/app/ui/intermediaries/loading";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RecipeKamu | View Profile",
    description: "This is a simple website that aims to provide users with the ability to easily create recipes, then share them via a simple link, or simply keep the link for their own reference. View and edit your account details.",
  };

export default async function Page(){
    const tokenIsValid = await validateToken()
    let refresh = false
    
    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        refresh = true
    }
    if(tokenIsValid.success===false&&tokenIsValid.tryRefresh===false){
        revalidatePath('/users/login?next='+"users/profile");
        redirect('/users/login/?next='+"users/profile")
    }
       

    if(refresh===false){
        const getUserDetailsResp = await GETUserDetails()
        if(!getUserDetailsResp){
            notFound()
        }
        if(getUserDetailsResp.status!==200&&getUserDetailsResp.status!==204){
            notFound()
        }

        const user = await getUserDetailsResp.json()

        return (
            <Suspense fallback={<Loading/>}>
            <main className="border border-t-0 rounded-md bg-gray-50 p-4 md:p-6 sm:max-w-[508px] lg:w-[55%] mx-auto">
            <UserProfile user={user}></UserProfile>
            </main>
            </Suspense>
        )
        }else{
            return <RefreshRetry nextPage={"/users/profile"}></RefreshRetry>
        }
}