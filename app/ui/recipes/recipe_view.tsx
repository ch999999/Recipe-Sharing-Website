'use client'
import { goToEditRecipe } from "@/app/lib/actions";
import { RefObject, useEffect, useRef, useState } from "react";
import UtilityBar from "./recipe_view_utility_bar";
import DeletionModal from "./recipe_delete_modal";
import { Description_Image, Ingredient, Instruction, Note, Recipe } from "@/app/lib/definitions";
import { convertToMetric, convertToImperial } from "@/app/lib/converters/metric-imperial_Converter";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

function editRecipe(uuid:string){
    goToEditRecipe(uuid)
}

export default function View({recipeData, uuid}:{recipeData:{recipe_description_media:Description_Image, recipe:Recipe, has_edit_permission:boolean}, uuid:string}){

    const [showDelete, setShowDelete] = useState(false);
    const canEdit = recipeData.has_edit_permission
    const recipe = recipeData.recipe; 
    const recipe_media = recipeData.recipe_description_media;
    const title = recipe.title
    const description = recipe.description
    const prepTime = recipe.prep_Time_Mins
    const cookTime = recipe.cook_Time_Mins
    const servings = recipe.servings

    const descriptionImageRef = useRef<HTMLImageElement>(null)
    const descriptionImageButtonRef = useRef(null)
    const instructionImagesRef = useRef<Map<string, HTMLImageElement>|null>(null)
    const instructionImagesButtonsRef = useRef<Map<string, HTMLElement>|null>(null)

    const oriIngredients = recipe.ingredients
    const [ingredients, setIngredients] = useState(oriIngredients)
    const [showIngredientsUnitTooltip, setShowIngredientUnitTooltip] = useState(false)
    const oriInstructions = recipe.instructions
    const [instructions, setInstructions] = useState(oriInstructions)
    const [showInstructionsUnitTooltip, setShowInstructionsUnitTooltip] = useState(false)
    function compareIngredientsBySequence(a:Ingredient,b:Ingredient){
        return a.ingredient_Number - b.ingredient_Number
    }
    if(ingredients){
    ingredients.sort(compareIngredientsBySequence)
    }
    const notes = recipe.notes
    function compareNotesBySequence(a:Note,b:Note){
        return a.note_Number-b.note_Number
    }
    if(notes){
    notes.sort(compareNotesBySequence)
    }
    function compareInstructionsBySequence(a:Instruction,b:Instruction){
        return a.sequence_Number - b.sequence_Number
    }
    if(instructions){
    instructions.sort(compareInstructionsBySequence)
    }
    let description_media_url = null;
    let description_media_description = null;
    if(recipe_media){
        description_media_url = recipe_media.url
        description_media_description = recipe_media.description
    }

    function getMap():Map<string,HTMLElement>{
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
    let ingredientItems;
    if(ingredients){
    ingredientItems = ingredients.map(i=>
        
        <tbody key={i.uuid}>
            <tr>
            <td className="w-5 align-top"><p className="text-left">{i.ingredient_Number+"."}</p></td>
            <td><p className="ml-2">{i.description}</p></td>
            </tr>
        </tbody>
        
        )
    }

    let instructionItems;
    if(instructions){
    instructionItems = instructions.map(i=>
        
        <tbody key={i.uuid}>
            <tr>
            <td className="w-5 align-top"><p className="text-left">{i.sequence_Number+"."}</p></td>
            <td>
                <div className="ml-2">
                <p>{i.description}</p>
                {i.images&&i.images.length>0 && i.images[0].url!==null && 
                 <div className=" flex flex-col"><img className=" relative w-[70%] aspect-[97/56]" ref={(node)=>{const map=getMap(); if(!i.uuid){return} if(node){map.set(i.uuid, node);}else{map.delete(i.uuid)}}}  src={i.images[0].url} alt=""></img><button ref={(node)=>{const map = getInstrImageButtonMap(); if(!i.uuid){return} if(node){map.set(i.uuid, node);}else{map.delete(i.uuid)}}} className=" w-[80px] h-[24px] outline outline-1 text-sm bg-opacity-45 bg-zinc-200 relative ml-1 bottom-[26px] z-[2] print:hidden" onClick={()=>{const imageMap = getMap(); if(!i.uuid){return} const imageRef = imageMap.get(i.uuid); const buttonMap = getInstrImageButtonMap(); const buttonRef = buttonMap.get(i.uuid); if(!imageRef||!buttonRef){return} changeImageVisibility2(imageRef, buttonRef)}}>Hide image</button></div>} 
                </div>
            </td>
            </tr>
        </tbody>
        
        )
    }

    let noteItems;
    if(notes){
    noteItems = notes.map(n=>
        
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
       
        )
    }

    function changeImageVisibility(imageRef:RefObject<HTMLImageElement>, buttonRef:RefObject<HTMLElement>){
        if(!imageRef.current||!buttonRef.current){
            return
        }
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

    function changeImageVisibility2(imageRef:HTMLElement, buttonRef:HTMLElement){
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

    function convertIngredientsToMetric(){
        const metricIngredients = oriIngredients?.map(i=>{
            return {
                ...i,
                description: convertToMetric(i.description)
            }
        })
        setIngredients(metricIngredients)
    }

    function convertIngredientsToImperial(){
        const imperialIngredients = oriIngredients?.map(i=>{
            return {
                ...i,
                description: convertToImperial(i.description)
            }
        })
        setIngredients(imperialIngredients)
    }

    function resetIngredients(){
        setIngredients(oriIngredients)
    }

    function changeIngredientUnits(system:string){
        if(system.toLowerCase()==="metric"){
            convertIngredientsToMetric()
        }else if(system.toLocaleLowerCase()==="imperial"){
            convertIngredientsToImperial()
        }else{
            resetIngredients()
        }
    }

    function convertInstructionsToMetric(){
        const imperialInstructions = oriInstructions?.map(i=>{
            return {
                ...i,
                description: convertToMetric(i.description)
            }
        })
        setInstructions(imperialInstructions)
    }

    function convertInstructionsToImperial(){
        const imperialInstructions = oriInstructions?.map(i=>{
            return {
                ...i,
                description: convertToImperial(i.description)
            }
        })
        setInstructions(imperialInstructions)
    }

    function resetInstructions(){
        setInstructions(oriInstructions)
    }

    function changeInstructionUnits(system:string){
        if(system.toLowerCase()==="metric"){
            convertInstructionsToMetric()
        }else if(system.toLocaleLowerCase()==="imperial"){
            convertInstructionsToImperial()
        }else{
            resetInstructions()
        }
    }

    if(!recipe.uuid||!recipe.title){
        return
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
            <div className="flex flex-row">
            <h2 className="font-bold">Ingredients</h2>
            <div className="ml-2 print:hidden">Units:</div>
            <select className="print:hidden ml-2 rounded outline outline-1 outline-gray-400" onChange={e=>{changeIngredientUnits(e.target.value)}}>
                <option>Original</option>
                <option>Metric</option>
                <option>Imperial</option>
            </select>
            <div className="relative">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowIngredientUnitTooltip(true)} onMouseLeave={()=>setShowIngredientUnitTooltip(false)}></InformationCircleIcon>
                        {showIngredientsUnitTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showIngredientsUnitTooltip && <p className="p-1 text-left bg-gray-600 text-white tooltip absolute w-[300px] right-1 translate-x-12 z-10 top-[40px]">Detects and converts measurements from one measurement system into another. Pays no attention to context, which may result in unexpected changes that alter the meaning of the recipe. Always refer to original for the author&apos;s intended instructions. Teaspoons, tablespoons, quarts, pints, fluid ounces, gallons etc. are assumed to be the US standard.</p>}
                    </div>
            </div>
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
            <div className="flex flex-row"> 
            <h2 className="font-bold">Instructions</h2>
            <div className="ml-2 print:hidden">Units:</div>
            <select className="print:hidden ml-2 rounded outline outline-1 outline-gray-400" onChange={e=>{changeInstructionUnits(e.target.value)}}>
                <option>Original</option>
                <option>Metric</option>
                <option>Imperial</option>
            </select>
            <div className="relative">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowInstructionsUnitTooltip(true)} onMouseLeave={()=>setShowInstructionsUnitTooltip(false)}></InformationCircleIcon>
                        {showInstructionsUnitTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showInstructionsUnitTooltip && <p className="p-1 text-left bg-gray-600 text-white tooltip absolute w-[300px] right-1 translate-x-12 z-10 top-[40px]">Detects and converts measurements from one measurement system into another. Pays no attention to context, which may result in unexpected changes that alter the meaning of the recipe. Always refer to original for the author&apos;s intended instructions. Teaspoons, tablespoons, quarts, pints, fluid ounces, gallons etc. are assumed to be the US standard.</p>}
                    </div>
            </div>   
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
                <button className="mt-1 btn w-24 bg-green-400 print:hidden" onClick={(e)=>{e.preventDefault(); if(!recipe.uuid){return} editRecipe(recipe.uuid)}}>Edit</button></div>}
                
            </div>
            </main>
        </>
    )
}