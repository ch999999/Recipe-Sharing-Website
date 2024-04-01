import { GETRecipe } from "@/app/api/recipes"
import { notFound, redirect } from "next/navigation"

import View from "@/app/ui/recipes/recipe_view"
import { redirectToLogin } from "@/app/lib/actions"
import { revalidatePath } from "next/cache"
import { validateToken } from "@/app/lib/auth"
import PrivateRecipeError from "@/app/ui/errors/privateRecipe"
import NonexistantRecipeError from "@/app/ui/errors/nonexistantRecipe"
import Loading from "@/app/ui/intermediaries/loading"
import { Suspense } from "react"
import RefreshRetry from "@/app/ui/intermediaries/refreshRetry"

export default async function Page({params}:{params:{uuid:string}}){
    const uuid = params.uuid
    
    const tokenIsValid = await validateToken()
    let refresh = false
    // let recipeData = {
    //     recipe: {
    //       uuid: 'uuid',
    //       title: 'Loading...',
    //       description: 'description',
    //       prep_Time_Mins: 20,
    //       cook_Time_Mins: 170,
    //       servings: 3,
    //       meal_Type: null,
    //       source: null,
    //       ownerUUID: '00000000-0000-0000-0000-000000000000',
    //       owner: null,
    //       createdDate: '2024-02-26T06:53:45.917941Z',
    //       lastModifiedDate: '2024-03-18T09:37:03.367089Z',
    //       isViewableByPublic: false,
    //       cuisineId: 1,
    //       cuisine: { id: 1, cuisine_Name: 'N/A' },
    //       difficultyId: 1,
    //       difficulty: { id: 1, difficulty_Name: 'Easy' },
    //       tags: [],
    //       diets: [],
    //       images: [],
    //       videos: [],
    //       ingredients: [
            
    //       ],
    //       policies: [  ],
    //       ratings: [],
    //       notes: [ ],
    //       instructions: [
            
    //       ]
    //     },
    //     recipe_description_media: {
    //       uuid: 'uuid',
    //       url: 'url',
    //       description: null,
    //       filetype: 'image',
    //       recipeUUID: 'uuid',
    //       filename: 'image1.png',
    //       imageBase64: null,
    //       fileExtension: null
    //     },
    //     has_edit_permission: false
    //   }

    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        refresh = true
    }
    if(refresh===false){
    const recipeResp = await GETRecipe(uuid)
    const res = await recipeResp?.json()
    
    if(recipeResp.status===401&&res.error==="You need to be signed in to access this resource"){
        return <PrivateRecipeError></PrivateRecipeError>
    }
    if(recipeResp.status===401&&res.error==="You do not have permission to access this resource"){
        return <PrivateRecipeError></PrivateRecipeError>
    }
    if(recipeResp.status===404||recipeResp.status===400){
        return <NonexistantRecipeError></NonexistantRecipeError>
    }
    
    if(recipeResp.status===200){
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

    // if(recipeResp.status===401&&res.error==="You do not have permission to access this resource"){
        
    // }
    // const recipeData = await GETRecipe(uuid)
    // console.log(recipeData)

    // if(!recipeData||!recipeData.recipe){
    //     notFound()
    // }
    
    
}