'use server'

import { createUser, signUserOut } from '../api/users'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { signinUser } from '../api/users'
import { deleteRefreshTokenFromCookie, getRefreshTokenFromCookie, putRefreshTokenIntoCookie, putTokenIntoCookie } from './auth'
import { deleteTokenFromCookie } from './auth'
import { DELETEDescriptionImage, DELETERecipe, DELETEUnusedImages, GETUserRecipes, POSTInstructionImage, POSTUpdatedDescriptionImage, POSTUploadUpdatedRecipeImage, PUTRecipe } from '../api/recipes'
import { POSTNewRecipe } from '../api/recipes'
import validateRecipe from './validators/RecipeValidator'
import * as base64 from 'byte-base64'
import { POSTDescriptionImage } from '../api/recipes'
import validateLogin from './validators/loginValidator'
import validateNewUser from './validators/newUserValidator'
import { refreshToken } from '../api/users'
import { validateToken } from './auth'
import NonexistantRecipeError from '../ui/errors/nonexistantRecipe'
import { Ingredient, Instruction, Note } from './definitions'

export type State = {
    errorField?: string | null;
     message?: string | null;
     index: number | null;
}

export async function userLogin(formData:FormData, nexturl:string){
    const loginCreds = {
        identifier: formData.get('identifier')?.toString(),
        password: formData.get('password')?.toString()
    }
    // let nextUrl="";
    // if(!nexturl.nexturl){
        
    // }
    // else{
    // nextUrl = nexturl.nexturl.replace("!","/")
    // }
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
        putTokenIntoCookie(loginRes.accessToken)
        putRefreshTokenIntoCookie(loginRes.refreshToken)
        if(nexturl===null){
            nexturl=""
        }
        //nextUrl = decodeURIComponent(nextUrl)
        console.log("nextUrl: "+nexturl)
        revalidatePath('/'+nexturl,'layout')
        redirect('/'+nexturl)
    }
}

export async function signoutUser(){
    try{
        await signUserOut()
    }catch{

    }
    deleteTokenFromCookie()
    deleteRefreshTokenFromCookie()
    //revalidatePath('/')
    revalidatePath('/')
    redirect('/')

}

export async function createNewRecipe(formData: FormData){
    
    const tokenIsValid = await validateToken()
    
    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        const tokenRefresh = await refreshToken()
        if(tokenRefresh.error){
            revalidatePath('/users/login?next='+encodeURIComponent('recipes/new'))
            redirect('/users/login?next='+encodeURIComponent('recipes/new'))
        }
    }

    if(tokenIsValid.success===false&&tokenIsValid.tryRefresh===false){
        deleteTokenFromCookie()
        deleteRefreshTokenFromCookie()
        revalidatePath('/users/login')
        redirect('/users/login')
    }

    const ingredientList = formData.getAll('ingredient-description')
    let ingredients:Ingredient[]=[];
    ingredientList.forEach(function(i){
      ingredients.push({ingredient_Number: ingredients.length+1, description: i.toString()})
    })

    const noteList = formData.getAll('notes')
    let notes:Note[]=[];
    noteList.forEach(function(n){
      notes.push({note_Number: notes.length+1, description: n.toString()})
    })

    const instructionList = formData.getAll('instruction-description')
    let instructions:Instruction[]=[];
    instructionList.forEach(function(i){
      instructions.push({sequence_Number: instructions.length+1, description: i.toString()})
    })

    const accessibility = formData.get('accessibility')
    let isViewableByPublic = false
    if(accessibility==="public"){
        isViewableByPublic = true
    }

    
    const prepTime = Number(formData.get('prep-time'))
    const cookTime = Number(formData.get('cook-time'))
    const servings = Number(formData.get('servings'))
    
    
    //console.log(JSON.stringify(instructions))
    let recipe = {
      title: formData.get('title')?.toString(),
      description: formData.get('description')?.toString(),
      difficultyId: 1,
      prep_Time_Mins: prepTime,
      cook_Time_Mins: cookTime,
      servings: servings,
      isViewableByPublic: isViewableByPublic,
      cuisineId: 1,
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

export async function deleteRecipe(recipeUUID:string, recipeTitle:string){
    const tokenIsValid = await validateToken()
    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        const tokenRefresh = await refreshToken()
        if(tokenRefresh.error){
            revalidatePath('/users/login?next='+encodeURIComponent('recipes/'+recipeUUID+'/edit'))
            redirect('/users/login?next='+encodeURIComponent('recipes/'+recipeUUID+'/edit'))
        }
    }
    if(tokenIsValid.success===false&&tokenIsValid.tryRefresh===false){
        deleteTokenFromCookie()
        deleteRefreshTokenFromCookie()
        revalidatePath('/users/login')
        redirect('/users/login')
    }
    const resp = await DELETERecipe(recipeUUID)
    if(!resp){
        //proper ui response
        return
    }
    if(resp.status===200||resp.status===204){
        redirect('/recipes/delete-success/'+encodeURIComponent(recipeTitle))
    }
}

export async function updateRecipe(formData: FormData){
    const tokenIsValid = await validateToken()
    
    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        const tokenRefresh = await refreshToken()
        if(tokenRefresh.error){
            revalidatePath("/users/login?next="+encodeURIComponent("recipes/"+formData.get('recipe-uuid')+"/edit"))
            redirect("/users/login?next="+encodeURIComponent("recipes/"+formData.get('recipe-uuid')+"/edit"))
        }
    }

    if(tokenIsValid.success===false&&tokenIsValid.tryRefresh===false){
        deleteTokenFromCookie()
        deleteRefreshTokenFromCookie()
        revalidatePath('/users/login')
        redirect('/users/login')
    }

    const ingredientList = formData.getAll('ingredient-description')
    let ingredients:Ingredient[]=[];
    ingredientList.forEach(function(i){
      ingredients.push({ingredient_Number: ingredients.length+1, description: i.toString()})
    })

    const noteList = formData.getAll('notes')
    let notes:Note[]=[];
    noteList.forEach(function(n){
      notes.push({note_Number: notes.length+1, description: n.toString()})
    })

    const instructionList = formData.getAll('instruction-description')
    let instructions:Instruction[]=[];
    instructionList.forEach(function(i){
      instructions.push({sequence_Number: instructions.length+1, description: i.toString(), images:[]})
    })

    const accessibility = formData.get('accessibility')
    let isViewableByPublic = false
    if(accessibility==="public"){
        isViewableByPublic = true
    }

    //fileter out instruction image selection radiobutton options
    const filteredKeys = Array.from(formData.keys()).filter(key => key.startsWith('instruction-image-option-'));
    // Retrieve values for the filtered keys
    const values = filteredKeys.map(key => formData.getAll(key));

    const instructionUrls = formData.getAll("instruction-image-url")

    const filenames = formData.getAll("instruction-image-filename")

    for(let i=0; i<values.length; i++){
        if(values[i].toString()==="existing"){
            const instruction = instructions[i]
            if(!instruction.images){
                continue
            }
            instruction.images.push({filename: filenames[i].toString(), url: instructionUrls[i].toString(), image_Number:1})
        }
    }
    const prepTime = Number(formData.get('prep-time'))
    const cookTime = Number(formData.get('cook-time'))
    const servings = Number(formData.get('servings'))

    let recipe = {
        uuid: formData.get('recipe-uuid')?.toString(),
        title: formData.get('title')?.toString(),
        description: formData.get('description')?.toString(),
        prep_Time_Mins: prepTime,
        cook_Time_Mins: cookTime,
        servings: servings,
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

    const resp = await PUTRecipe(recipe)
    if(!resp){
        //proper ui response
        return
    }  
    if(resp.status===400||resp.status===404){
        notFound()
    }
    if(resp.status===401){
        notFound()
    }    
    const recipeUpdateResponse = await resp.json()


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
            filename: descpImageFilename?.toString(),
            url: descpImageUrl?.toString()
        }
        console.log("descImageUrl: "+descpImageUrl)
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

    let oriImageUrls = formData.getAll('oriImageUrls')
    // const oriImageUrlsJson = {
    //     urlList: oriImageUrls
    // }
    //console.log("oriImageUrls: "+JSON.stringify(oriImageUrlsJson))
    await DELETEUnusedImages(oriImageUrls)

    revalidatePath('/recipes/'+recipe.uuid)
    redirect('/recipes/'+recipe.uuid)
    
}

export async function goToEditRecipe(uuid:string){
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
        username: formData.get('username')?.toString(),
        email: formData.get('email')?.toString(),
        firstname: formData.get('firstname')?.toString(),
        lastname: formData.get('lastname')?.toString(),
        password: formData.get('password')?.toString()
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
            putRefreshTokenIntoCookie(loginRes.refreshToken)
            putTokenIntoCookie(loginRes.accessToken)
            revalidatePath('/', "layout")
            redirect('/')
        }
    }

}



export async function tokenRefresh(nexturl:string){
    const tokenRefresh = await refreshToken()
        if(tokenRefresh.error){
            deleteRefreshTokenFromCookie()
            deleteTokenFromCookie()
            
            const nextUrlEncoded = encodeURIComponent(nexturl)
            revalidatePath('/users/login?next='+nextUrlEncoded)
            redirect('/users/login?next='+nextUrlEncoded)
        }
        
        revalidatePath('/'+nexturl)
        redirect('/'+nexturl)
}

export async function redirectToLogin(nexturl:string){
    
    revalidatePath('/users/login/'+nexturl)
    redirect('/users/login/'+nexturl)
}

export async function fetchUserRecipes(){
    const recipes = await GETUserRecipes()
    console.log("GOTRecipes: "+ recipes)
    return recipes
}