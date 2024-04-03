import { getTokenFromCookie } from "../lib/auth";
import { Description_Image, Instruction_Image, Recipe } from "../lib/definitions";
export const dynamic='force-dynamic'

export async function POSTNewRecipe(recipe:Recipe){
    try{
    const token = await getTokenFromCookie()
    const resp = await fetch(
        process.env.BACKEND_BASE_URL+"/api/Recipe",{ 
            method:"POST",
            mode:"cors",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(recipe)
        }
    )
    const res = await resp.json()
    console.log(res)
    return res

    }catch(error){
        console.log(error)
    }
}

export async function POSTDescriptionImage(image:Description_Image){
    try{
        const token = await getTokenFromCookie()
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/Recipe/AddDescriptionImage",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+token
                },
                body: JSON.stringify(image)
            }
        )
        const res = await resp.json()
        console.log(res)
        return res
    }catch(error){
        console.log(error)
    }
}

export async function POSTInstructionImage(image:Instruction_Image){
    try{
        const token = await getTokenFromCookie()
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/Recipe/AddInstructionImage",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+token
                },
                body: JSON.stringify(image)
            }
        )
        // const res=await resp.json()
        // console.log(res)
        // return res
    }catch(error){
        console.log(error)
    }
}

export async function PUTRecipe(recipe:Recipe){
    try{
        const token = await getTokenFromCookie()
        const resp  =await fetch(
            process.env.BACKEND_BASE_URL+"/api/Recipe/UpdateRecipe",{
                method:"PUT",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+token
                },
                body: JSON.stringify(recipe)
            }
        )
        return resp
        // const res = await resp.json()
        // console.log(res)
        // return res
    }catch(error){
        
        console.log(error)
    }
}

export async function GETRecipe(uuid:string){
    try{
        const token =await getTokenFromCookie()
        if(token){
        const resp  =await fetch(
            process.env.BACKEND_BASE_URL+"/api/Recipe/"+uuid,{
                method: "GET",
                headers:{
                    "Authorization": "Bearer "+token
                }
            }         
        )
        //const res= await resp.json()
        //return res
        return resp
        }else{
            const resp  =await fetch(
                process.env.BACKEND_BASE_URL+"/api/Recipe/NoAuth/"+uuid,{
                    method: "GET",
                    headers:{
                        
                    }
                }         
            )
            // const res= await resp.json()
            // return res
            console.log("respstatus:"+resp.status)
            return resp
        }
        
    }catch(error){
        console.log(error)
    }
}

export async function GETUserRecipes(){
    try{
        const token = await getTokenFromCookie()
        if(token){
            const resp  =await fetch(
                process.env.BACKEND_BASE_URL+"/api/Recipe/User",{
                    method: "GET",
                    headers:{
                        "Authorization": "Bearer "+token
                    }
                }         
            )
            const res= await resp.json()
            return res
        }
}   catch(error){
        console.log(error)
    }
}

export async function DELETEDescriptionImage(recipeUUID:string){
    try{
        const token = await getTokenFromCookie()
        
        if(token){
            const resp = await fetch(
                process.env.BACKEND_BASE_URL+"/api/Recipe/DescriptionImage/"+recipeUUID,{
                    method: "DELETE",
                    headers:{
                        "Authorization": "Bearer "+token
                    }
                }
            )
            // const res = await resp.json()
            // return res
        }
    }catch(error){
        console.log(error)
    }
}

export async function POSTUploadUpdatedRecipeImage(image:Description_Image){
    try{
        const token = await getTokenFromCookie()
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/Recipe/UpdateUploadDescriptionImage",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+token
                },
                body: JSON.stringify(image)
            }
        )
        //const res=await resp.json()
        console.log(resp)
        return resp
    }catch(error){
        console.log(error)
    }
}

export async function POSTUpdatedDescriptionImage(image:Description_Image){
    try{
        const token = await getTokenFromCookie()
        console.log("descImage: "+JSON.stringify(image))
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/Recipe/UpdateDescriptionImage",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+token
                },
                body: JSON.stringify(image)
            }
        )
        console.log(resp)
        const res=await resp.json()
        console.log(res)
        return res
    }catch(error){
        console.log(error)
    }
}

export async function DELETERecipe(recipeUUID:string){
    try{
        const token = await getTokenFromCookie()

        if(token){
            const resp = await fetch(
                process.env.BACKEND_BASE_URL+"/api/Recipe/Delete/"+recipeUUID,{
                    method: "DELETE",
                    headers:{
                        "Authorization": "Bearer "+token
                    }
                }
            )
            //const res = await resp.json()
            return resp
        }
    }catch(error){
        console.log(error)
    }
}

export async function DELETEUnusedImages(imgUrls:string[]|FormDataEntryValue[]){
    try{
        const token = await getTokenFromCookie()
        console.log(imgUrls)
        console.log("imgUrls: "+JSON.stringify(imgUrls))
        if(token){
            const resp = await fetch(
                process.env.BACKEND_BASE_URL+"/api/Recipe/UnusedImages/Delete",{
                    method: "DELETE",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": "Bearer "+token
                    },
                    body: JSON.stringify(imgUrls)
                }
            )
            
            //const res = await resp.json()
            //console.log(resp)
            return resp
        }
    }catch(error){
        console.log(error)
    }
}
