import { GETRecipe } from "@/app/api/recipes"
import { notFound } from "next/navigation"
import View from "@/app/ui/recipes/recipe_view"

export default async function Page({params}:{params:{uuid:string}}){
    const uuid = params.uuid
    const recipeData = await GETRecipe(uuid)
    console.log(recipeData)

    if(!recipeData||!recipeData.recipe){
        notFound()
    }

    return(
        <View recipeData = {recipeData}>

        </View>
    )
}