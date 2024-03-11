'use server'

import { createUser } from '../api/users'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signinUser } from '../api/users'
import { putTokenIntoCookie } from './auth'
import { deleteTokenFromCookie } from './auth'
import { DELETEDescriptionImage, POSTInstructionImage, POSTUpdatedDescriptionImage, POSTUploadUpdatedRecipeImage, PUTRecipe, getDiets } from '../api/recipes'
import { POSTNewRecipe } from '../api/recipes'
import validateRecipe from './validators/RecipeValidator'
import * as base64 from 'byte-base64'
import { POSTDescriptionImage } from '../api/recipes'
import validateLogin from './validators/loginValidator'
import validateNewUser from './validators/newUserValidator'

export type State = {
    errorField?: string | null;
     message?: string | null;
     index: number | null;
}

export async function userLogin(formData:FormData){
    const loginCreds = {
        identifier: formData.get('identifier'),
        password: formData.get('password')
    }
    const loginValidationRes = validateLogin(loginCreds)
    if(loginValidationRes!==null){
        return loginValidationRes
    }
    const loginRes  = await signinUser(loginCreds)

    if(loginRes.errorField){
        return{
            errorField: loginRes.errorField,
            message: loginRes.message       
        }
    }else{
        putTokenIntoCookie(loginRes.token)
        revalidatePath('/')
        redirect('/')
    }
}

export async function signoutUser(){
    deleteTokenFromCookie()
    revalidatePath('/')
    redirect('/')
}

export async function createNewRecipe(prevState: State, formData: FormData){
    
    // const tagList: FormDataEntryValue[] = formData.getAll('tags')  
    // let tags:{id: FormDataEntryValue}[]=[];
    // tagList.forEach(function(t: FormDataEntryValue){
    //   tags.push({id: t})
    // })

    // const dietList = formData.getAll('diets')
    // let diets=[];
    // dietList.forEach(function(d){
    //   diets.push({id: d})
    // })

    const ingredientList = formData.getAll('ingredient-description')
    let ingredients=[];
    ingredientList.forEach(function(i){
      ingredients.push({ingredient_Number: ingredients.length+1, description: i})
    })

    const noteList = formData.getAll('notes')
    let notes=[];
    noteList.forEach(function(n){
      notes.push({note_Number: notes.length+1, description: n})
    })

    const instructionList = formData.getAll('instruction-description')
    let instructions=[];
    instructionList.forEach(function(i){
      instructions.push({sequence_Number: instructions.length+1, description: i})
    })

    const accessibility = formData.get('accessibility')
    let isViewableByPublic = false
    if(accessibility==="public"){
        isViewableByPublic = true
    }

    //console.log(JSON.stringify(instructions))
    let recipe = {
      title: formData.get('title'),
      description: formData.get('description'),
      difficultyId: 1,
      prep_Time_Mins: formData.get('prep-time'),
      cook_Time_Mins: formData.get('cook-time'),
      servings: formData.get('servings'),
      isViewableByPublic: isViewableByPublic,
      cuisineId: 1,
    //   tags: tags,
    //   diets: diets,
      ingredients: ingredients,
      notes: notes,
      instructions: instructions
    }

    const recipeErrors = validateRecipe(recipe)
    if(recipeErrors){
      console.log(JSON.stringify(recipeErrors))
      return recipeErrors
    }

    console.log("All clear")
    const recipeCreationResponse = await POSTNewRecipe(recipe)

    if(!recipeCreationResponse.uuid){ //if does not contain property, was unsuccessful
        console.log("Recipe creation failed")
        return
    }

    console.log("Instructions: "+JSON.stringify(recipeCreationResponse.instructions))

    //Upload description image, if any
    const descriptionImage = formData.get('description-image') as File
    if(descriptionImage.size>0){
        console.log("Uploading "+descriptionImage.name+"...")
        const descriptionImageName = descriptionImage.name
        const imageReader = descriptionImage.stream().getReader()
        const descriptionImageU8:number[] = [];
    
        while(true){
            const {done,value} = await imageReader.read();
            if(done) break;

            descriptionImageU8.push(...value);
        }
        const descriptionImageBase64 = base64.bytesToBase64(descriptionImageU8)
        const descriptionImageFileExtension = descriptionImageName.slice(descriptionImageName.lastIndexOf('.'))
        const descImageJson = {
            recipeUUID: recipeCreationResponse.uuid,
            filetype: "image",
            imageBase64: descriptionImageBase64,
            fileExtension: descriptionImageFileExtension,
            filename: descriptionImage.name
        }
    
    await POSTDescriptionImage(descImageJson)
    }

    const instructionImageList = formData.getAll('instruction-image') as File[]
    const createdInstructions = recipeCreationResponse.instructions

    for(let j=0; j<instructionImageList.length; j++){
        //console.log("Instruction image "+j+" "+instructionImageList[j].name)
        if(instructionImageList[j].size>0){
            console.log("Uploading "+instructionImageList[j].name+"...")
            const instructionImageName = instructionImageList[j].name
            const imageReader = instructionImageList[j].stream().getReader()
            const instructionImageU8:number[]=[];
            while(true){
                const {done,value} = await imageReader.read();
                if(done) break;

                instructionImageU8.push(...value);
            }
            const instructionImageBase64 = base64.bytesToBase64(instructionImageU8)
            const instructionImageFileExtension = instructionImageName.slice(instructionImageName.lastIndexOf('.'))
            
            const instrImageJson = {
                instructionUUID: createdInstructions[j].uuid,
                imageBase64: instructionImageBase64,
                fileExtension: instructionImageFileExtension,
                filename: instructionImageList[j].name
            }
            
            await POSTInstructionImage(instrImageJson)
        }
    }

    redirect('/recipes/'+recipeCreationResponse.uuid)

}

export async function updateRecipe(prevState: State, formData: FormData){
    //do nothing

    const ingredientList = formData.getAll('ingredient-description')
    let ingredients=[];
    ingredientList.forEach(function(i){
      ingredients.push({ingredient_Number: ingredients.length+1, description: i})
    })

    const noteList = formData.getAll('notes')
    let notes=[];
    noteList.forEach(function(n){
      notes.push({note_Number: notes.length+1, description: n})
    })

    const instructionList = formData.getAll('instruction-description')
    let instructions=[];
    instructionList.forEach(function(i){
      instructions.push({sequence_Number: instructions.length+1, description: i, images:[]})
    })

    const accessibility = formData.get('accessibility')
    let isViewableByPublic = false
    if(accessibility==="public"){
        isViewableByPublic = true
    }

    //console.log(JSON.stringify(instructions))
    

    
    
    //console.log(JSON.stringify(recipe))

    //fileter out instruction image selection radiobutton options
    const filteredKeys = Array.from(formData.keys()).filter(key => key.startsWith('instruction-image-option-'));
    // Retrieve values for the filtered keys
    const values = filteredKeys.map(key => formData.getAll(key));

    const instructionUrls = formData.getAll("instruction-image-url")

    const filenames = formData.getAll("instruction-image-filename")

    for(let i=0; i<values.length; i++){
        if(values[i].toString()==="existing"){
            instructions[i].images.push({filename: filenames[i], url: instructionUrls[i], image_Number:1})
        }
    }

    let recipe = {
        uuid: formData.get('recipe-uuid'),
        title: formData.get('title'),
        description: formData.get('description'),
        prep_Time_Mins: formData.get('prep-time'),
        cook_Time_Mins: formData.get('cook-time'),
        servings: formData.get('servings'),
        isViewableByPublic: isViewableByPublic,
        ingredients: ingredients,
        notes: notes,
        instructions: instructions
      }

    const recipeErrors = validateRecipe(recipe)
    if(recipeErrors){
        console.log(JSON.stringify(recipeErrors))
        return recipeErrors
      }
  
      console.log("All clear")
      console.log("Recipe: "+JSON.stringify(recipe))

      
    const recipeUpdateResponse = await PUTRecipe(recipe)


    if(!recipeUpdateResponse.uuid){ //if does not contain property, was unsuccessful
        console.log("Recipe creation failed")
        return
    }
    //Upload description image, if any

    const descriptionImageOption = formData.get('description-image-option')
    if(descriptionImageOption==="new"){
        const descriptionImage = formData.get('description-image') as File
        if(descriptionImage.size>0){
            console.log("Uploading "+descriptionImage.name+"...")
            const descriptionImageName = descriptionImage.name
            const imageReader = descriptionImage.stream().getReader()
            const descriptionImageU8:number[] = [];
        while(true){
            const {done,value} = await imageReader.read();
            if(done) break;

            descriptionImageU8.push(...value);
        }
        const descriptionImageBase64 = base64.bytesToBase64(descriptionImageU8)
        const descriptionImageFileExtension = descriptionImageName.slice(descriptionImageName.lastIndexOf('.'))
        const descImageJson = {
            recipeUUID: recipeUpdateResponse.uuid,
            filetype: "image",
            imageBase64: descriptionImageBase64,
            fileExtension: descriptionImageFileExtension,
            filename: descriptionImage.name
        }

        await POSTUploadUpdatedRecipeImage(descImageJson)
    }
    }else if(descriptionImageOption==="existing"){
        const descpImageUrl = formData.get("description-image-url")
        const descpImageFilename = formData.get("description-image-filename")
        const descImageJson={
            recipeUUID: recipeUpdateResponse.uuid,
            filetype: "image",
            filename: descpImageFilename,
            url: descpImageUrl
        }
        console.log("descImage: "+JSON.stringify(descImageJson))
        await POSTUpdatedDescriptionImage(descImageJson)
    }else if(descriptionImageOption==="none"){
        const recipeUUID = recipeUpdateResponse.uuid
        await DELETEDescriptionImage(recipeUUID)
    }



    const instructionImageList = formData.getAll('instruction-image') as File[]
    const createdInstructions = recipeUpdateResponse.instructions

    for(let j=0; j<instructionImageList.length; j++){
        if(values[j].toString()==="new" && instructionImageList[j].size>0){
            console.log("Uploading "+instructionImageList[j].name+"...")
            const instructionImageName = instructionImageList[j].name
            const imageReader = instructionImageList[j].stream().getReader()
            const instructionImageU8:number[]=[];
            while(true){
                const {done,value} = await imageReader.read();
                if(done) break;

                instructionImageU8.push(...value);
            }
            const instructionImageBase64 = base64.bytesToBase64(instructionImageU8)
            const instructionImageFileExtension = instructionImageName.slice(instructionImageName.lastIndexOf('.'))
            
            const instrImageJson = {
                instructionUUID: createdInstructions[j].uuid,
                imageBase64: instructionImageBase64,
                fileExtension: instructionImageFileExtension,
                filename: instructionImageList[j].name
            }
            
            await POSTInstructionImage(instrImageJson)
        }
    }
}

export async function goToEditRecipe(uuid){
    redirect('/recipes/'+uuid+'/edit')
}

export async function createNewUser(formData: FormData){
    if(formData.get('password')!==formData.get('password-confirmation')){
        return {
            errorField: "password-confirmation",
            message:"password and confirm-password do not match"
        }
    }
    const user = {
        username: formData.get('username'),
        email: formData.get('email'),
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        password: formData.get('password')
    } 
    const userValidationError = validateNewUser(user)
    if(userValidationError){
        return userValidationError
    }
    const res = await createUser(user)

    //if response has property called errorField, that means validation error
    if(res.errorField){
        return{
            errorField:res.errorField,
            message:res.message
        } 
    }else{
        console.log("Created new user:"+JSON.stringify(res))
        const loginCreds = {identifier: user.username, password: user.password}
        const loginRes = await signinUser(loginCreds)

        if(loginRes.errorField){
            console.log("Error logging in: "+JSON.stringify(loginRes))
            redirect('/users/login')
        }else{
            putTokenIntoCookie(loginRes.token)
            revalidatePath('/')
            redirect('/')
        }
    }

}

export async function fetchDiets(){
    const diets = await getDiets();
    return diets;
}