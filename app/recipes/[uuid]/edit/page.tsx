import { GETRecipe } from "@/app/api/recipes";
import RecipeEditPage from "@/app/ui/recipes/recipe_edit_form";
import { validateToken } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import RefreshRetry from "@/app/ui/intermediaries/refreshRetry";
import PrivateRecipeError from "@/app/ui/errors/privateRecipe";
import NonexistantRecipeError from "@/app/ui/errors/nonexistantRecipe";
import CannotModifyRecipeError from "@/app/ui/errors/cannotModifyRecipeError";
import { Suspense } from "react";
import Loading from "@/app/ui/intermediaries/loading";

export default async function Page({params}:{params:{uuid:string}}){
    const uuid = params.uuid
    const tokenValidationRes = await validateToken()
    let refresh = false
    
    if(tokenValidationRes.tryRefresh&&tokenValidationRes.tryRefresh===true){
        refresh = true
    }
    if(tokenValidationRes.success===false&&tokenValidationRes.tryRefresh===false){
        const nextPageEncoded = encodeURIComponent("recipes/"+uuid+"/edit")
        revalidatePath('/users/login?next='+nextPageEncoded);
        redirect('/users/login?next='+nextPageEncoded)
    }

    if(tokenValidationRes.success===true){
    const recipeResp = await GETRecipe(uuid)
    const recipeData = await recipeResp?.json()
    
    if(recipeResp?.status===401){
        return <PrivateRecipeError></PrivateRecipeError>
    }

    if(recipeResp?.status===404||recipeResp?.status===400){
        return <NonexistantRecipeError></NonexistantRecipeError>
    }

    if(!recipeData.has_edit_permission){
        return <CannotModifyRecipeError></CannotModifyRecipeError>
    }

    return (
        <Suspense fallback={<Loading/>}>
        <RecipeEditPage recipeData={recipeData}>

        </RecipeEditPage>
        </Suspense>
    )
    }else{
        return(
            <RefreshRetry nextPage={"recipes/"+uuid+"/edit"}></RefreshRetry>
        )
    }
}