export default function validateRecipe(recipe){
    const titleErrors = validateTitle(recipe.title)
    if(titleErrors){
        return titleErrors
    }

    const descriptionErrors = validateDescription(recipe.description)
    if(descriptionErrors){
        return descriptionErrors
    }

    const ingredientErrors = validateIngredients(recipe.ingredients)
    if(ingredientErrors){
        return ingredientErrors
    }

    const noteErrors = validateNotes(recipe.notes)
    if(noteErrors){
        return noteErrors
    }

    const instructionErrors = validateInstructions(recipe.instructions)
    if(instructionErrors){
        return instructionErrors
    }

    const prepTimeErrors = validatePrepTime(recipe.prep_Time_Mins)
    if(prepTimeErrors){
        return prepTimeErrors
    }

    const cookTimeErrors = validateCookTime(recipe.cook_Time_Mins)
    if(cookTimeErrors){
        return cookTimeErrors
    }

    const servingsErrors = validateServings(recipe.servings)
    if(servingsErrors){
        return servingsErrors
    }

    return null
}

function validateTitle(title){
    const removedWhiteSpace = title.replace(/\s/g, '');
    if(removedWhiteSpace.length<3){
        return {
            errorField: "title",
            message: "Min. 3 non-space characters required"
        }
    }

    if(title.length>50){
        return{
            errorField:"title",
            message:"Max. length of 50 characters allowed"
        }
    }
    return null

}

function validateDescription(description){
    const removedWhiteSpace = description.replace(/\s/g, '');
    if(removedWhiteSpace.length<12){
        return {
            errorField: "description",
            message: "Min. 12 non-space characters required"
        }
    }

    if(description.length>250){
        return{
            errorField:"description",
            message:"Max. length of 250 characters allowed"
        }
    }
    return null
}

function validateIngredients(ingredients:[{ingredient_Number: number, description: string}]){
    for(let j=0; j<ingredients.length; j++){
        const removedWhiteSpace=ingredients[j].description.replace(/\s/g, '');
        if(removedWhiteSpace.length<5){
            return{
                errorField: "ingredients",
                message: "Min. 5 non-space characters required",
                index: ingredients[j].ingredient_Number
            }
        }

        if(ingredients[j].description.length>100){
            return{
                errorField: "ingredients",
                message: "Max. 100 characters allowed",
                index: ingredients[j].ingredient_Number
            }
        }
    }
    
    return null;
}

function validateNotes(notes){
    for(let j=0; j<notes.length; j++){
        const removedWhiteSpace=notes[j].description.replace(/\s/g, '');
        if(removedWhiteSpace.length<5){
            return{
                errorField: "notes",
                message: "Min. 5 non-space characters required",
                index: notes[j].note_Number
            }
        }

        if(notes[j].description.length>100){
            return{
                errorField: "notes",
                message: "Max. 100 characters allowed",
                index: notes[j].note_Number
            }
        }
    }
    return null;
}

function validateInstructions(instructions){
    for(let j=0; j<instructions.length; j++){
        const removedWhiteSpace=instructions[j].description.replace(/\s/g, '');
        if(removedWhiteSpace.length<5){
            return{
                errorField: "instructions",
                message: "Min. 5 non-space characters required",
                index: instructions[j].sequence_Number
            }
        }

        if(instructions[j].description.length>200){
            return{
                errorField: "instructions",
                message: "Max. 200 characters allowed",
                index: instructions[j].ingredient_Number
            }
        }
    }
    return null;
}

function validatePrepTime(preptime){
    if(preptime===null || preptime===""){
        return{
            errorField: "prep_time",
            message: "Required"
        } 
    }

    const isInteger = /^\d+$/.test(preptime);
    if(!isInteger){
        return{
            errorField: "prep_time",
            message: "Positive integers only"
        }
    }
    if(preptime<=0){
        return{
            errorField: "prep_time",
            message: "Min. 1"
        }
    }
}

function validateCookTime(cooktime){
    if(cooktime===null || cooktime===""){
        return{
            errorField: "cook_time",
            message: "Required"
        } 
    }

    const isInteger = /^\d+$/.test(cooktime);
    if(!isInteger){
        return{
            errorField: "cook_time",
            message: "Positive integers only"
        }
    }
    if(cooktime<=0){
        return{
            errorField: "cook_time",
            message: "Min. 1"
        }
    }
}

function validateServings(servings){
    if(servings===null || servings===""){
        return{
            errorField: "servings",
            message: "Required"
        } 
    }

    const isInteger = /^\d+$/.test(servings);
    if(!isInteger){
        return{
            errorField: "servings",
            message: "Postive integers only"
        }
    }
    if(servings<=0){
        return{
            errorField: "servings",
            message: "Min. 1"
        }
    }

}