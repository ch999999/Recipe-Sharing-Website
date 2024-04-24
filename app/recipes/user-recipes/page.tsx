import { validateToken } from "@/app/lib/auth"
import { GETUserRecipes } from "@/app/api/recipes"
import Loading from "@/app/ui/intermediaries/loading"
import { Suspense } from "react"
import UserRecipes from "@/app/ui/recipes/user-recipes"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import RefreshRetry from "@/app/ui/intermediaries/refreshRetry"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "RecipeKamu | Your Recipes",
    description: "This is a simple website that aims to provide users with the ability to easily create recipes, then share them via a simple link, or simply keep the link for their own reference. Your recipes.",
  };

export default async function Page(){
    const tokenIsValid = await validateToken()
    let recipeList = []
    let refresh = false
    let isLoggedIn = false
    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        refresh = true
    }
    if(tokenIsValid.success===false&&tokenIsValid.tryRefresh===false){
        revalidatePath('/users/login?next='+"recipes/user-recipes");
        redirect('/users/login/?next='+"recipes/user-recipes")
    }
    if(tokenIsValid.success===true){
        isLoggedIn = true
        recipeList = await GETUserRecipes()
    }


    if(refresh===false){
    return(
        <Suspense fallback={<Loading/>}>
            <main className="flex min-h-screen flex-col mx-auto w-[97%] lg:max-w-[1100px]">
            <UserRecipes recipeList={recipeList}></UserRecipes>
            </main>
        </Suspense>
    )
    }else{
        return <RefreshRetry nextPage={"recipes/user-recipes"}></RefreshRetry>
    }

}