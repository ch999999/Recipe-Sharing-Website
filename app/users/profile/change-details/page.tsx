import Form from "@/app/ui/profile/edit-details"
import { validateToken } from "@/app/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { GETUserDetails } from "@/app/api/users"
import { Suspense } from "react"
import Loading from "@/app/ui/intermediaries/loading"
import RefreshRetry from "@/app/ui/intermediaries/refreshRetry"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "RecipeKamu | Edit Profile",
    description: "This is a simple website that aims to provide users with the ability to easily create recipes, then share them via a simple link, or simply keep the link for their own reference. Edit your account details",
  };

export default async function Page(){
    const tokenIsValid = await validateToken()
    let refresh = false
    
    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        refresh = true
    }
    if(tokenIsValid.success===false&&tokenIsValid.tryRefresh===false){
        revalidatePath('/users/login?next='+"users/profile/change-details");
        redirect('/users/login/?next='+"users/profile/change-details")
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
            <Form user={user}></Form>
            </Suspense>
        )
        }else{
            return <RefreshRetry nextPage={"/users/profile/change-details"}></RefreshRetry>
        }
}