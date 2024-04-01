'use client'
import Image from "next/image";
import { goToEditRecipe } from "@/app/lib/actions";
import { useRef, useState } from "react";
import UtilityBar from "./recipe_view_utility_bar";
import { tokenRefresh } from "@/app/lib/actions";

import DeletionModal from "./recipe_delete_modal";
import { useFormStatus } from "react-dom";

function editRecipe(uuid){
    goToEditRecipe(uuid)
}



let imageCount = 0



export default function View({recipeData, uuid}){
    

    const [showDelete, setShowDelete] = useState(false);
    const canEdit = recipeData.has_edit_permission
    const recipe = recipeData.recipe; 
    const recipe_media = recipeData.recipe_description_media;
    const title = recipe.title
    const description = recipe.description
    const prepTime = recipe.prep_Time_Mins
    const cookTime = recipe.cook_Time_Mins
    const servings = recipe.servings

    const descriptionImageRef = useRef(null)
    const descriptionImageButtonRef = useRef(null)
    const instructionImagesRef = useRef(null)
    const instructionImagesButtonsRef = useRef(null)

    const ingredients = recipe.ingredients
    function compareIngredientsBySequence(a,b){
        return a.ingredient_Number - b.ingredient_Number
    }
    ingredients.sort(compareIngredientsBySequence)

    const notes = recipe.notes
    function compareNotesBySequence(a,b){
        return a.noteNumber-b.noteNumber
    }
    notes.sort(compareNotesBySequence)

    const instructions = recipe.instructions
    function compareInstructionsBySequence(a,b){
        return a.sequence_Number - b.sequence_Number
    }
    instructions.sort(compareInstructionsBySequence)
    
    let description_media_url = null;
    let description_media_description = null;
    if(recipe_media){
        description_media_url = recipe_media.url
        description_media_description = recipe_media.description
    }

    function getMap(){
        if(!instructionImagesRef.current){
            instructionImagesRef.current = new Map()
        }
        return instructionImagesRef.current
    }

    function getInstrImageButtonMap(){
        if(!instructionImagesButtonsRef.current){
            instructionImagesButtonsRef.current = new Map()
        }
        return instructionImagesButtonsRef.current
    }

    const ingredientItems = ingredients.map(i=>
        <>
        <tbody key={i.uuid}>
            <tr>
            <td className="w-5 align-top"><p className="text-left">{i.ingredient_Number+"."}</p></td>
            <td><p className="ml-2">{i.description}</p></td>
            </tr>
        </tbody>
        </>
        )

    const instructionItems = instructions.map(i=>
        <>
        <tbody key={i.uuid}>
            <tr>
            <td className="w-5 align-top"><p className="text-left">{i.sequence_Number+"."}</p></td>
            <td>
                <div className="ml-2">
                <p>{i.description}</p>
                {i.images.length>0 && i.images[0].url!==null && 
                 <div className=" flex flex-col"><img className=" relative w-[70%] aspect-[97/56]" ref={(node)=>{const map=getMap(); if(node){map.set(i.uuid, node);}else{map.delete(i.uuid)}}}  src={i.images[0].url} alt=""></img><button ref={(node)=>{const map = getInstrImageButtonMap(); if(node){map.set(i.uuid, node);}else{map.delete(i.uuid)}}} className=" w-[80px] h-[24px] outline outline-1 text-sm bg-opacity-45 bg-zinc-200 relative ml-1 bottom-[26px] z-[2] print:hidden" onClick={()=>{const imageMap = getMap(); const imageRef = imageMap.get(i.uuid); const buttonMap = getInstrImageButtonMap(); const buttonRef = buttonMap.get(i.uuid); changeImageVisibility2(imageRef, buttonRef)}}>Hide image</button></div>} 
                </div>
            </td>
            </tr>
        </tbody>
        </>
        )

    const noteItems = notes.map(n=>
        <>
        <tbody key={n.uuid}>
            <tr>
                <td className="w-5 align-top"><p className="text-left">{n.note_Number+"."}</p></td>
                <td>
                    <div className="ml-2">
                    <p>{n.description}</p>
                    </div>
                </td>
            </tr>
        </tbody>
        </>
        // <>
        //     <p key={n.uuid}>{n.note_Number+". "}{n.description}</p>
        // </>
        )

    function changeImageVisibility(imageRef, buttonRef){
        if(imageRef.current.style.display=="none"){
            imageRef.current.style.display="inline-block"
            buttonRef.current.style.bottom="24px"
            buttonRef.current.style.marginBottom="0"
            buttonRef.current.innerText = "Hide image"
        }else{
            imageRef.current.style.display="none"
            buttonRef.current.style.bottom="0"
            buttonRef.current.style.marginBottom="24px"
            buttonRef.current.innerText="Show image"
        }
        
    }

    function changeImageVisibility2(imageRef, buttonRef){
        if(imageRef.style.display=="none"){
            imageRef.style.display="inline-block"
            buttonRef.style.bottom="24px"
            buttonRef.style.marginBottom="0"
            buttonRef.innerText = "Hide image"
        }else{
            imageRef.style.display="none"
            buttonRef.style.bottom="0"
            buttonRef.style.marginBottom="24px"
            buttonRef.innerText="Show image"
        }
    }

    function hideDeleteModal(){
        setShowDelete(false)
    }

    

    return (
        <>
            <UtilityBar></UtilityBar>
            {showDelete && <DeletionModal hide={hideDeleteModal} recipeUUID={recipe.uuid} recipeTitle={recipe.title}></DeletionModal>}
            <h1 className="text-center text-xl font-bold">{title}</h1>

            <main className="mb-40 mx-auto w-[97%] border rounded-lg border-gray-400 p-2 lg:max-w-[1100px]">
            <section key="description-section">
            {/* <p>Description:</p> */}
            {description_media_url!==null && <div><img ref={descriptionImageRef} src={description_media_url} className=" relative w-[100%] aspect-[97/56] mx-auto" alt=""></img><button ref={descriptionImageButtonRef} className=" outline outline-1 text-sm bg-opacity-45 bg-zinc-200 relative ml-1 bottom-[26px] z-[2] print:hidden" onClick={()=>changeImageVisibility(descriptionImageRef,descriptionImageButtonRef)}>Hide image</button></div>}
            {description_media_url===null && <p className="font-bold mb-5 print:mb-0">Description:</p>}
            <h1 className="-mt-5 print:mt-0">{description}</h1>
            </section>

            <section key="times-section" className = "mt-3">
            <p className=" font-bold">Prep time: <span className="font-normal">{" "+prepTime+" minutes"}</span></p>
            <p className="font-bold">Cook time: <span className="font-normal">{" "+cookTime+" minutes"}</span></p>
            <p className="font-bold">Servings: <span className="font-normal">{" "+servings+ " servings"}</span></p>
            </section>

            <section className = "mt-3" key="ingredients-section">
            <h2 className="font-bold">Ingredients</h2>
            <table className="table-auto w-[100%]">
                <thead>
                    <tr>
                        <th className="hidden">No.</th>
                        <th className="hidden">Ingredient</th>
                    </tr>
                </thead>
                {ingredientItems}
            </table>
            </section>

            <section className = "mt-3" key="instructions-section">
            <h2 className="font-bold">Instructions</h2>
            <table className="table-auto w-[100%]">
                <thead>
                    <tr>
                        <th className="hidden">No.</th>
                        <th className="hidden">Instruction</th>
                    </tr>
                </thead>
                {instructionItems}
            </table>
            </section>

            <section className = "mt-3" key="notes-section">
            <h2 className="font-bold">Notes</h2>
            <table className="table-auto w-[100%]">
                <thead>
                    <tr>
                        <th className="hidden">No.</th>
                        <th className="hidden">Note</th>
                    </tr>
                </thead>
                {noteItems}
            </table>
            </section>

            <div className="flex flex-row-reverse">
                
                {canEdit &&<div> <button type="button" className="mt-1 btn w-24 bg-red-500 print:hidden" onClick={()=>setShowDelete(true)}>Delete</button> 
                <button className="mt-1 btn w-24 bg-green-400 print:hidden" onClick={(e)=>{e.preventDefault(); editRecipe(recipe.uuid)}}>Edit</button></div>}
                
            </div>
            </main>
        </>
    )
}