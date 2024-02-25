import { getTokenFromCookie } from "../lib/auth";
export const dynamic='force-dynamic'

export async function getDiets(){
    try{
        const resp = await fetch(process.env.BACKEND_BASE_URL+"/api/Recipe/diets",{cache: 'no-store'})
        const res = await resp.json();
        return res
    }catch(error){
        console.log(error)
    }
}

export async function getTags(){
    try{
        const resp = await fetch(process.env.BACKEND_BASE_URL+"/api/Recipe/tags",{cache: 'no-store'})
        const res = await resp.json();
        return res
    }catch(error){
        console.log(error)
    }
}

export async function getCuisines(){
    try{
        const resp = await fetch(process.env.BACKEND_BASE_URL+"/api/Recipe/cuisines",{cache: 'no-store'})
        
        const res = await resp.json();
        return res
    }catch(error){
        console.log(error)
    }
}

export async function getDifficulties(){
    try{
        const resp = await fetch(process.env.BACKEND_BASE_URL+"/api/Recipe/difficulties",{cache: 'no-store'})
        const res = await resp.json();
        return res
    }catch(error){
        console.log(error)
    }
}

export async function POSTNewRecipe(recipe){
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

export async function POSTDescriptionImage(image){
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
    }catch(error){
        console.log(error)
    }
}

export async function POSTInstructionImage(image){
    try{
        const token = await getTokenFromCookie()
        const resp = await fetch(
            process.env.BACKEND_BASE_URL+"/api/Recipe/AddInstructionImage",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorzation": "Bearer "+token
                },
                body: JSON.stringify(image)
            }
        )
        const res=await resp.json()
        console.log(res)
    }catch(error){
        console.log(error)
    }
}

export async function GETRecipe(uuid){
    try{
        const token  =await getTokenFromCookie()
        const resp  =await fetch(
            process.env.BACKEND_BASE_URL+"/api/Recipe?UUID="+uuid,{
                method: "GET",
                headers:{
                    "Authorization": "Bearer "+token
                }
            }
        )
    }catch(error){
        console.log(error)
    }
}