import { GETRecipe } from "@/app/api/recipes";
import { notFound } from "next/navigation";
import RecipeEditPage from "@/app/ui/recipes/recipe_edit_form";

export default async function Page({params}:{params:{uuid:string}}){
    const uuid = params.uuid
    const recipeData = await GETRecipe(uuid)
    console.log(recipeData)

    if(!recipeData||!recipeData.recipe){
        notFound()
    }

    return (
        <RecipeEditPage recipeData={recipeData}>

        </RecipeEditPage>
    )
}