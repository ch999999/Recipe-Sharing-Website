import { validateToken } from "@/app/lib/auth"
import RefreshRetry from "@/app/ui/intermediaries/refreshRetry"
import Form from "@/app/ui/recipes/recipe-creation-form"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "RecipeKamu | Create Recipe",
    description: "This is a simple website that aims to provide users with the ability to easily create recipes, then share them via a simple link, or simply keep the link for their own reference. Create your recipe.",
  };

export default async function Page(){
    const tokenIsValid = await validateToken()
    let refresh = false
    
    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        refresh = true
    }
    if(tokenIsValid.success===false&&tokenIsValid.tryRefresh===false){
        revalidatePath('/users/login?next='+"recipes/new");
        redirect('/users/login/?next='+"recipes/new")
    }
    
    if(refresh===false){
    return (
        <>      
            <Form></Form> 
        </>
    )
    }else{
        return <RefreshRetry nextPage={"recipes/new"}></RefreshRetry>
    }
}