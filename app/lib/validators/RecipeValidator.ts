import { Ingredient, Instruction, Note, Recipe } from "../definitions"

export default function validateRecipe(recipe:Recipe){
    if(!recipe.title){
        return {
            errorField: "title",
            message: "Min. 3 non-space characters required"
        }
    }
    const titleErrors = validateTitle(recipe.title)
    if(titleErrors){
        return titleErrors
    }

    if(!recipe.description){
        return {
            errorField: "description",
            message: "Min. 5 non-space characters required"
        }
    }
    const descriptionErrors = validateDescription(recipe.description)
    if(descriptionErrors){
        return descriptionErrors
    }

    if(!recipe.ingredients){
        return{
            errorField: "ingredients",
            message: "At least one ingredient required",
            index: 1
        }
    }
    const ingredientErrors = validateIngredients(recipe.ingredients)
    if(ingredientErrors){
        return ingredientErrors
    }

    if(recipe.notes){
    const noteErrors = validateNotes(recipe.notes)
    if(noteErrors){
        return noteErrors
    }
    }

    if(!recipe.instructions){
        return{
            errorField: "instructions",
            message: "At least one instruction required",
            index: 1
        }
    }
    const instructionErrors = validateInstructions(recipe.instructions)
    if(instructionErrors){
        return instructionErrors
    }

    if(!recipe.prep_Time_Mins){
        return{
            errorField: "prep_time",
            message: "Required"
        } 
    }
    const prepTimeErrors = validatePrepTime(recipe.prep_Time_Mins)
    if(prepTimeErrors){
        return prepTimeErrors
    }

    if(!recipe.cook_Time_Mins){
        return{
            errorField: "cook_time",
            message: "Required"
        } 
    }
    const cookTimeErrors = validateCookTime(recipe.cook_Time_Mins)
    if(cookTimeErrors){
        return cookTimeErrors
    }

    if(!recipe.servings){
        return{
            errorField: "servings",
            message: "Required"
        }
    }
    const servingsErrors = validateServings(recipe.servings)
    if(servingsErrors){
        return servingsErrors
    }

    return null
}

function validateTitle(title:string){
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

function validateDescription(description:string){
    const removedWhiteSpace = description.replace(/\s/g, '');
    if(removedWhiteSpace.length<5){
        return {
            errorField: "description",
            message: "Min. 5 non-space characters required"
        }
    }

    if(description.length>3000){
        return{
            errorField:"description",
            message:"Max. length of 3000 characters allowed"
        }
    }
    return null
}

function validateIngredients(ingredients:Ingredient[]){
    for(let j=0; j<ingredients.length; j++){ 
        const ingredient = ingredients[j]
        if(!ingredient.description){
            return{
                errorField: "ingredients",
                message: "Min. 5 non-space characters required",
                index: ingredients[j].ingredient_Number
            }
        }
        const removedWhiteSpace=ingredient.description.replace(/\s/g, '');
        if(removedWhiteSpace.length<5){
            return{
                errorField: "ingredients",
                message: "Min. 5 non-space characters required",
                index: ingredients[j].ingredient_Number
            }
        }

        if(ingredient.description.length>800){
            return{
                errorField: "ingredients",
                message: "Max. 800 characters allowed",
                index: ingredients[j].ingredient_Number
            }
        }
    }
    
    return null;
}

function validateNotes(notes:Note[]){
    for(let j=0; j<notes.length; j++){
        const note = notes[j]
        if(!note.description){
            return{
                errorField: "notes",
                message: "Min. 5 non-space characters required",
                index: notes[j].note_Number
            }
        }
        const removedWhiteSpace=note.description.replace(/\s/g, '');
        if(removedWhiteSpace.length<5){
            return{
                errorField: "notes",
                message: "Min. 5 non-space characters required",
                index: notes[j].note_Number
            }
        }

        if(note.description.length>800){
            return{
                errorField: "notes",
                message: "Max. 800 characters allowed",
                index: notes[j].note_Number
            }
        }
    }
    return null;
}

function validateInstructions(instructions:Instruction[]){
    for(let j=0; j<instructions.length; j++){
        const instruction = instructions[j]
        if(!instruction.description){
            return{
                errorField: "instructions",
                message: "Min. 5 non-space characters required",
                index: instructions[j].sequence_Number
            }
        }
        const removedWhiteSpace=instruction.description.replace(/\s/g, '');
        if(removedWhiteSpace.length<5){
            return{
                errorField: "instructions",
                message: "Min. 5 non-space characters required",
                index: instructions[j].sequence_Number
            }
        }

        if(instruction.description.length>1000){
            return{
                errorField: "instructions",
                message: "Max. 1000 characters allowed",
                index: instructions[j].sequence_Number
            }
        }
    }
    return null;
}

function validatePrepTime(preptime:number){
    if(Number.isNaN(preptime)||preptime===null || preptime.toString()===""){
        return{
            errorField: "prep_time",
            message: "Required"
        } 
    }

    const isInteger = /^\d+$/.test(preptime.toString());
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

function validateCookTime(cooktime:number){
    if(Number.isNaN(cooktime)||cooktime===null || cooktime.toString()===""){
        return{
            errorField: "cook_time",
            message: "Required"
        } 
    }

    const isInteger = /^\d+$/.test(cooktime.toString());
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

function validateServings(servings:number){
    if(Number.isNaN(servings)||servings===null || servings.toString()===""){
        return{
            errorField: "servings",
            message: "Required"
        } 
    }

    const isInteger = /^\d+$/.test(servings.toString());
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