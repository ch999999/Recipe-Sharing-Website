import Form from "@/app/ui/recipes/recipe_creation_form_mobile_proportionate"
import { getDiets, getTags } from "@/app/api/recipes"
import { getCuisines } from "@/app/api/recipes"
import { getDifficulties } from "@/app/api/recipes"

export default async function Page(){
    const diets = await getDiets()
    const cuisines = await getCuisines()
    const difficulties = await getDifficulties()
    const tags = await getTags()
    return (
        <>
            
            <h1 className=" mb-3 text-center text-2xl font-bold">Create your recipe</h1>
            <Form diets={diets} cuisines={cuisines} difficulties={difficulties} tags={tags}/>
        </>
    )
}