import { GETRecipe } from "@/app/api/recipes"
import View from "@/app/ui/recipes/recipe_view"
import { validateToken } from "@/app/lib/auth"
import PrivateRecipeError from "@/app/ui/errors/privateRecipe"
import NonexistantRecipeError from "@/app/ui/errors/nonexistantRecipe"
import Loading from "@/app/ui/intermediaries/loading"
import { Suspense } from "react"
import RefreshRetry from "@/app/ui/intermediaries/refreshRetry"
import { Recipe } from "@/app/lib/definitions"

export default async function Page({params}:{params:{uuid:string}}){
    const uuid = params.uuid
    
    const tokenIsValid = await validateToken()
    let refresh = false

    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        refresh = true
    }
    if(refresh===false){
    const recipeResp = await GETRecipe(uuid)
    const res = await recipeResp?.json()
    
    if(recipeResp?.status===401&&res.error==="You need to be signed in to access this resource"){
        return <PrivateRecipeError></PrivateRecipeError>
    }
    if(recipeResp?.status===401&&res.error==="You do not have permission to access this resource"){
        return <PrivateRecipeError></PrivateRecipeError>
    }
    if(recipeResp?.status===404||recipeResp?.status===400){
        return <NonexistantRecipeError></NonexistantRecipeError>
    }
    
    if(recipeResp?.status===200){
        const recipeData = res
        console.log(recipeData)
        return(
            <Suspense fallback={<Loading/>}>
            <View recipeData = {recipeData} uuid={uuid}>
    
            </View>
            </Suspense>
        )
    }else{
        return <NonexistantRecipeError></NonexistantRecipeError>
    }
}else{
    return(
        <RefreshRetry nextPage={"recipes/"+uuid}></RefreshRetry>
    )
}    
}