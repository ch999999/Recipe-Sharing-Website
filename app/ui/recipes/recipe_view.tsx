import Image from "next/image";

export default function View({recipeData}){
    const recipe = recipeData.recipe; 
    const recipe_media = recipeData.recipe_description_media;
    const title = recipe.title
    const description = recipe.description
    const prepTime = recipe.prep_Time_Mins
    const cookTime = recipe.cook_Time_Mins
    const servings = recipe.servings
    const createdDate = recipe.createdDate
    const lastModifiedDate = recipe.lastModifiedDate
    const cuisine = recipe.cuisine.cuisine_Name
    const difficulty = recipe.difficulty.difficulty_Name

    const tags = recipe.tags
    const diets = recipe.diets

    const ingredients = recipe.ingredients
    function compareIngredientsBySequence(a,b){
        return a.ingredient_Number - b.ingredient_Number
    }
    ingredients.sort(compareIngredientsBySequence)

    const notes = recipe.notes
    function compareNotesBySequence(a,b){
        return a.noteNumber-b.noteNumber
    }
    notes.sort(compareIngredientsBySequence)

    const instructions = recipe.instructions
    function compareInstructionsBySequence(a,b){
        return a.sequence_Number - b.sequence_Number
    }
    instructions.sort(compareInstructionsBySequence)

    const description_media_url = recipe_media.url
    const description_media_description = recipe_media.description

    const ingredientItems = ingredients.map(i=>
        <p key={i.uuid}>{i.ingredient_Number+". "}{i.description}</p>
        )

    const instructionItems = instructions.map(i=>
        <>
        <div key={i.uuid}>
        <p>{i.sequence_Number+". "+i.description}</p>
        {i.images.length>0 && i.images[0].url!==null && <img src={i.images[0].url} width={500} height={500} alt=""></img>}
        </div>
        </>
        )

    return (
        <>
            <h1 className="text-center text-xl font-bold">{title}</h1>

            <main className="ml-3 mb-24">
            <section>
            <p>Description:</p>
            {description_media_url!==null && <img src={description_media_url} width={500} height={500} alt=""></img>}
            <p>{description}</p>
            </section>

            <section className = "mt-3">
            <p>Prep time: {" "+prepTime+" minutes"}</p>
            <p>Cook time: {" "+cookTime+" minutes"}</p>
            <p>Servings: {" "+servings+ " servings"}</p>
            </section>

            <section className = "mt-3">
            <p>Ingredients:</p>
            {ingredientItems}
            </section>

            <section className = "mt-3">
            <p>Instructions:</p>
            {instructionItems}
            </section>
            </main>
        </>
    )
}