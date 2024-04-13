'use client'
import { useRef } from "react"
import { useState } from "react"
import { updateRecipe } from "@/app/lib/actions"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import ValidateImage from "@/app/lib/validators/ImageValidator";
import {ArrowUpIcon} from "@heroicons/react/24/outline"
import {ArrowDownIcon} from "@heroicons/react/24/outline"
import { useFormStatus } from "react-dom"
import { Description_Image, FormError, Ingredient, Instruction, Note, Recipe } from "@/app/lib/definitions"

type InstructionFormData = { 
    id: number, 
    order: number, 
    description?: string, 
    imageFileName?: string, 
    fileChosen?: boolean, 
    imageButtonText?: string, 
    imageErrorText?: string, 
    existingImageFileName?: string, 
    existingImageUrl?: string
}

type InstructionImageFormData = {
    filename?:string,
    url?:string
}

type ImageFormData = {
    id:number, 
    filename?: string, 
    url?: string
}

type NoteFormData = {
    id:number,
    order:number,
    description:string
}

let ingredientCount=0
let instructionCount=0
let notesCount=0
let imagesCount=0

function jumpTo(element:HTMLElement|null){
    element?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    element?.focus()
}

function scrollToError(error:FormError){
    if(error===null){
        return
    }
    if(error.errorField==="title"){
        const input = document.getElementById("title-input")
        jumpTo(input)
    }else if(error.errorField==="description"){
        const input = document.getElementById("description-input")
        jumpTo(input)
    }else if(error.errorField==="ingredients"){
        const input = document.getElementById("ingredient-input-"+error.index)
        jumpTo(input)
    }else if(error.errorField==="notes"){
        const input = document.getElementById("note-input-"+error.index)
        jumpTo(input)
    }else if(error.errorField==="instructions"){
        const input = document.getElementById("instruction-input-"+error.index)
        jumpTo(input)
    }else if(error.errorField==="cook_time"){
        const input = document.getElementById("cook_time-input")
        jumpTo(input)
    }else if(error.errorField==="prep_time"){
        const input = document.getElementById("prep_time-input")
        jumpTo(input)
    }else if(error.errorField==="servings"){
        const input = document.getElementById("servings-input")
        jumpTo(input)
    }
}

function SubmitButton(){
    const status = useFormStatus()
    return <button className="btn btn-md min-w-24 bg-green-400">{status.pending ? (<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>):(<span>Update</span>)}</button>  
}

export default function RecipeEditPage({recipeData}:{recipeData:{recipe:Recipe, recipe_description_media:Description_Image}}){
    let initialSetting = "none"
    let initialDescriptionImage:Description_Image = {}

    let initialInstructionImageSettings:string[] = []
    let initialInstructionImages:InstructionImageFormData[] = []

    const [showTitleTooltip, setShowTitleTooltip] = useState(false)
    const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false)
    const [showDescriptionImageTooltip, setShowDescriptionImageTooltip] = useState(false)
    const [showIngredientTooltip, setShowIngredientTooltip] = useState(false)
    const [showIngredientActionsTooltip,setShowIngredientActionsTooltip] = useState(false)
    const [showInstructionTooltip, setShowInstructionTooltip] = useState(false)
    const [showInstructionActionsTooltip,setShowInstructionActionsTooltip] = useState(false)
    const [showNotesTooltip, setShowNotesTooltip] = useState(false)
    const [showPrivateTooltip, setShowPrivateTooltip] = useState(false)
    const [showPublicTooltip, setShowPublicTooltip] = useState(false)
    const [showEnlargedDescriptionImage, setShowEnlargedDescriptionImage] = useState(false);
    
    const oriRecipe = recipeData.recipe
    const oriDescriptionMedia = recipeData.recipe_description_media
    const oriTitle = oriRecipe.title
    const oriDescription = oriRecipe.description
    const oriPrepTime = oriRecipe.prep_Time_Mins
    const oriCookTime = oriRecipe.cook_Time_Mins
    const oriServings = oriRecipe.servings

    const oriIngredients = oriRecipe.ingredients
    function compareIngredientsBySequence(a:Ingredient,b:Ingredient){
        return a.ingredient_Number - b.ingredient_Number
    }
    
    const oriIngredientsList:{id:number, order:number, description:string}[] = []
    if(oriIngredients){
    oriIngredients.sort(compareIngredientsBySequence)
    
    //remove fields not to be stored in React state
    oriIngredients.forEach(ingredient => {
        oriIngredientsList.push({id:ingredientCount,order:ingredient.ingredient_Number, description:ingredient.description})
        ingredientCount++
    });
    }

    const oriInstructions = oriRecipe.instructions
    function compareInstructionsBySequence(a:Instruction,b:Instruction){
        return a.sequence_Number - b.sequence_Number
    }

    const oriInstructionsList:InstructionFormData[] = []
    if(oriInstructions){
    oriInstructions.sort(compareInstructionsBySequence)
    
    oriInstructions.forEach(instruction => {
        if(!instruction.images||instruction.images.length<=0){
            initialInstructionImageSettings.push("none")
            initialInstructionImages.push({filename:"", url:"nil"})
            oriInstructionsList.push({id:instructionCount,order:instruction.sequence_Number, description:instruction.description, imageFileName:"No file chosen", fileChosen: false, imageButtonText: "Choose Image", imageErrorText: "", existingImageFileName: "", existingImageUrl: ""})
            instructionCount++
        }else{
            initialInstructionImageSettings.push("existing")       
            initialInstructionImages.push({filename:instruction.images[0].filename, url:instruction.images[0].url})
            oriInstructionsList.push({id:instructionCount,order:instruction.sequence_Number, description:instruction.description, imageFileName:"No file chosen", fileChosen: false, imageButtonText: "Repick Image", imageErrorText: "", existingImageFileName: instruction.images[0].filename, existingImageUrl: instruction.images[0].url})
            instructionCount++
        }
    });
    }

    const oriNotes = oriRecipe.notes
    function compareNotesBySequence(a:Note,b:Note){
        return a.note_Number - b.note_Number
    }

    const oriNotesList:NoteFormData[] = []
    if(oriNotes){
    oriNotes.sort(compareNotesBySequence)
    
    //remove fields not to be stored in React state
    oriNotes.forEach(note => {
        notesCount++
        oriNotesList.push({id:notesCount,order:note.note_Number, description:note.description})
    });
    }

    const oriImageList:ImageFormData[] = []
    if(oriDescriptionMedia){
        initialSetting="existing"
        initialDescriptionImage = oriDescriptionMedia
        imagesCount++
        oriImageList.push({id:imagesCount, filename: oriDescriptionMedia.filename, url: oriDescriptionMedia.url})
    }

    if(oriInstructions){
    oriInstructions.forEach(instruction => {
        if(!instruction.images){

        }else{
        if(instruction.images.length>0){
            imagesCount++
            oriImageList.push({id:imagesCount, filename:instruction.images[0].filename, url: instruction.images[0].url})
        }
        }
    });
    }

    function validateDescriptionImage(file:File){
        const error = ValidateImage(file)
        if(error){
            if(!descriptionImageRef||!descriptionImageRef.current){
                return
            }
            descriptionImageRef.current.files=null;
            setDescriptionImage({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})
            setDescriptionImageError(error.message)
        }else{
            setDescriptionImageError("")
        }
    
    }


    function resetTitle(){
        setTitle(oriTitle)
    }

    function resetDescription(){
        setDescription(oriDescription)
    }

    function resetPrepTime(){
        setPrepTime(oriPrepTime.toString())
    }

    function resetCookTime(){
        setCookTime(oriCookTime.toString())
    }

    function resetServings(){
        setServings(oriServings.toString())
    }

    function addIngredient(){
        ingredientCount++;
        setIngredients([
            ...ingredients,
            {id: ingredientCount, description: "", order: ingredients.length+1}
        ])
    }

    function resetIngredients(){
        setIngredients(oriIngredientsList)
    }

    function removeIngredient(id:number){
        const copy = [...ingredients]
        const afterRemovedIngredient = copy.filter(i=>
            i.id!=id
            )
        
            //reorder based on array index
            for(let j=0; j<afterRemovedIngredient.length; j++){
                afterRemovedIngredient[j].order = j+1
            }
        setIngredients(afterRemovedIngredient)
    }

    function resetInstructions(){
        setInstructions(oriInstructionsList)

    }

    function addInstruction(){
        instructionCount++;
        setInstructions([
            ...instructions,
            {id: instructionCount, description:"", order: instructions.length+1, imageFileName:"No file chosen", imageButtonText:"Choose Image",fileChosen: false, existingImageFileName: "", existingImageUrl: "",imageErrorText:""}
        ])
    }

    function removeInstruction(id:number){
        const copy = [...instructions]
        const afterRemovedInstruction = copy.filter(i=>i.id!=id)
            //reorder based on array index
            for(let j=0; j<afterRemovedInstruction.length; j++){
                afterRemovedInstruction[j].order = j+1
            }
        setInstructions(afterRemovedInstruction)
    }

    function removeInstructionImageFile(id:number){
        const map = getInstructionImageInputMap();
        const node = map.get(id);
        if(!node){
            return
        }
        node.files = null;
        const nextInstructions:InstructionFormData[] = instructions.map(i=>{
            if(i.id===id){
                return{
                    ...i,
                    imageFileName: "No file chosen",
                    fileChosen: false,
                    imageButtonText: "Choose Image"
                }
            }else{
                return i
            }
        })
        setInstructions(nextInstructions)
    }

    function resetNotes(){
        setNotes(oriNotesList)
    }

    function addNote(){
        setNotes([
            ...notes,
            {id: notesCount, description:"",order:notes.length+1}
        ])
        notesCount++;
    }

    function addNoteBelow(Id:number){
        const indexToAddBelow = notes.findIndex(({id})=>id===Id)
        notesCount++
        const nextNotes = [...notes.slice(0, indexToAddBelow+1),
        {id:notesCount, description:"", order:0},
        ...notes.slice(indexToAddBelow+1)]

        for(let j=0; j<nextNotes.length; j++){
            nextNotes[j].order = j+1
        }
        setNotes(nextNotes)
    }

    function moveNoteDown(Id:number){
        const noteToMoveDown = notes.find(({id})=>id===Id)
        if(!noteToMoveDown){
            return
        }
        if(noteToMoveDown.order>=notes.length){
            return
        }
        const noteBelow = notes.find(({order})=>order===noteToMoveDown.order+1)
        if(!noteBelow){
            return
        }
        const nextNotes = [...notes]
        nextNotes[noteToMoveDown.order-1] = noteBelow
        nextNotes[noteBelow.order-1] = noteToMoveDown
        for(let j=0; j<nextNotes.length; j++){
            nextNotes[j].order = j+1
        }
        setNotes(nextNotes)
    }

    function moveNoteUp(Id:number){
        const noteToMoveUp = notes.find(({id})=>id===Id)
        if(!noteToMoveUp){
            return
        }
        if(noteToMoveUp.order<=1){
            return
        }
        const noteAbove = notes.find(({order})=>order===noteToMoveUp.order-1)
        if(!noteAbove){
            return
        }
        const nextNotes = [...notes]
        nextNotes[noteToMoveUp.order-1] = noteAbove
        nextNotes[noteAbove.order-1] = noteToMoveUp
        for(let j=0; j<nextNotes.length; j++){
            nextNotes[j].order = j+1
        }
        setNotes(nextNotes)
    }

    function removeNote(id:number){
        const copy = [...notes]
        const nextNotes = copy.filter(i=>
            i.id!=id
            )
            //reorder based on array index
            for(let j=0; j<nextNotes.length; j++){
                nextNotes[j].order = j+1
            }
        setNotes(nextNotes)
    }

    function updateInstructionUrl(Id:number, imageIndex:number){
        const nextInstructions = instructions.map(i=>{
            if(i.id===Id){
                return{
                    ...i,
                    existingImageUrl: oriImageList[imageIndex].url
                }
            }else{
                return i
            }
        })
        setInstructions(nextInstructions)
    }

    function showPopupImage(id:number){
        const map = getInstrImagePopupMap()
        const node = map.get(id)
        if(!node){
            return
        }
        node.style.display = "inline"
    }

    function hidePopupImage(id:number){
        const map = getInstrImagePopupMap()
        const node = map.get(id)
        if(!node){
            return
        }
        node.style.display = "none"
    }

    function updateInstructionImage(id:number){
        const map = getInstructionImageInputMap();
        const node = map.get(id);
        if(!node||!node.files){
            return
        }
        const error = ValidateImage(node.files[0])

        if(!error){
         const nextInstructions:InstructionFormData[] = instructions.map(i=>{
            if(i.id === id){
                if(!node.files){
                    return i
                }
                return{
                    ...i,
                    imageFileName: node.files[0].name,
                    fileChosen: true,
                    imageButtonText: "Repick Image",
                    imageErrorText: ""
                }
            }else{
                return i
            }
        })
        setInstructions(nextInstructions)
        }else{
            const nextInstructions:InstructionFormData[] = instructions.map(i=>{
                if(i.id===id){
                    return{
                        ...i,
                        imageFileName: "No file chosen",
                        fileChosen: false,
                        imageButtonText: "Choose Image",
                        imageErrorText: error.message
                    }
                }else{
                    return i
                }
            })
            setInstructions(nextInstructions)
        }
    }

    function addIngredientBelow(Id:number){
        const indexToAddBelow = ingredients.findIndex(({id})=>id===Id)
        ingredientCount++
        const nextIngredients = [...ingredients.slice(0, indexToAddBelow+1),
        {id:ingredientCount, description:"", order:0},
        ...ingredients.slice(indexToAddBelow+1)]

        for(let j=0; j<nextIngredients.length; j++){
            nextIngredients[j].order = j+1
        }

        setIngredients(nextIngredients)

    }

    function moveIngredientUp(Id:number){
        const ingredientToMoveUp = ingredients.find(({id})=>id===Id)
        if(!ingredientToMoveUp){
            return
        }
        if(ingredientToMoveUp.order<=1){
            return
        }
        const ingredientAbove = ingredients.find(({order})=>order===ingredientToMoveUp.order-1)
        if(!ingredientAbove){
            return
        }
        const nextIngredients = [...ingredients]
        nextIngredients[ingredientToMoveUp.order-1] = ingredientAbove
        nextIngredients[ingredientAbove.order-1] = ingredientToMoveUp
        //reorder based on array index
        for(let j=0; j<nextIngredients.length; j++){
            nextIngredients[j].order = j+1
        }
        setIngredients(nextIngredients)
    }

    function moveIngredientDown(Id:number){
        const ingredientToMoveDown = ingredients.find(({id})=>id===Id)
        if(!ingredientToMoveDown){
            return
        }
        if(ingredientToMoveDown.order>=ingredients.length){
            return
        }
        const ingredientBelow = ingredients.find(({order})=>order===ingredientToMoveDown.order+1)
        if(!ingredientBelow){
            return
        }
        const nextIngredients = [...ingredients]
        nextIngredients[ingredientToMoveDown.order-1] = ingredientBelow
        nextIngredients[ingredientBelow.order-1] = ingredientToMoveDown
        //reorder based on array index
        for(let j=0; j<nextIngredients.length; j++){
            nextIngredients[j].order = j+1
        }
        setIngredients(nextIngredients)
    }

    function addInstructionBelow(Id:number){
        const indexToAddBelow = instructions.findIndex(({id})=>id===Id)
        instructionCount++
        const nextInstructions = [...instructions.slice(0, indexToAddBelow+1),
            {id: instructionCount, description:"", order: instructions.length+1, imageFileName:"No file chosen", imageButtonText:"Choose Image",fileChosen: false, existingImageFileName:"", existingImageUrl: ""},
        ...instructions.slice(indexToAddBelow+1)]

        for(let j=0; j<nextInstructions.length; j++){
            nextInstructions[j].order = j+1
        }

        setInstructions(nextInstructions)
    }

    function moveInstructionUp(Id:number){
        const instructionToMoveUp = instructions.find(({id})=>id===Id)
        if(!instructionToMoveUp){
            return
        }
        if(instructionToMoveUp.order<=1){
            return
        }
        const instructionAbove = instructions.find(({order})=>order===instructionToMoveUp.order-1)
        if(!instructionAbove){
            return
        }
        const nextInstructions = [...instructions]
        nextInstructions[instructionToMoveUp.order-1] = instructionAbove
        nextInstructions[instructionAbove.order-1] = instructionToMoveUp
        //reorder based on array index
        for(let j=0; j<nextInstructions.length; j++){
            nextInstructions[j].order = j+1
        }
        setInstructions(nextInstructions)
    }

    function moveInstructionDown(Id:number){
        const instructionToMoveDown = instructions.find(({id})=>id===Id)
        if(!instructionToMoveDown){
            return
        }
        if(instructionToMoveDown.order>=instructions.length){
            return
        }
        const instructionBelow = instructions.find(({order})=>order===instructionToMoveDown.order+1)
        if(!instructionBelow){
            return
        }
        const nextInstructions = [...instructions]
        nextInstructions[instructionToMoveDown.order-1] = instructionBelow
        nextInstructions[instructionBelow.order-1] = instructionToMoveDown
        //reorder based on array index
        for(let j=0; j<nextInstructions.length; j++){
            nextInstructions[j].order = j+1
        }
        setInstructions(nextInstructions)
    }

    const initialState = {errorField:null, message:null, index:null}
    const [state, setState] = useState<FormError>(initialState)
    const [existingDescriptionImage, setExistingDescriptionImage] = useState(initialDescriptionImage)
    const [existingDescriptionImageUrl, setExistingDescriptionImageUrl] = useState(initialDescriptionImage.url)

    const descriptionImageRef = useRef<HTMLInputElement>(null)
    const instructionImagesRef = useRef<Map<number, HTMLInputElement>|null>(null)
    const instructionUrlsRef = useRef<Map<number,HTMLInputElement>|null>(null)
    const instructionImagesMiniRef = useRef<Map<number, HTMLImageElement>|null>(null)
    const instructionImagesPopupRef = useRef<Map<number, HTMLElement>|null>(null)

    const [title, setTitle] = useState(oriTitle)
    const [description, setDescription] = useState(oriDescription)
    const [prepTime, setPrepTime] = useState(oriPrepTime.toString())
    const [cookTime, setCookTime] = useState(oriCookTime.toString())
    const [servings, setServings] = useState(oriServings.toString())

    const [descriptionImageError, setDescriptionImageError]=useState("")
    const [descriptionImage, setDescriptionImage] = useState({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})
    const [ingredients, setIngredients] = useState(oriIngredientsList)
    const [instructions, setInstructions] = useState(oriInstructionsList)
    const [notes, setNotes] = useState(oriNotesList)

    const imageItems = oriImageList.map(i=>
        <li className="flex flex-row" key={i.id}>{i.filename+": "}<input name="oriImageUrls" defaultValue={i.url}></input></li>
    )

    const imageSelectItems = oriImageList.map(i=>
        <option className=" flex flex-row" key={i.id} value={i.filename}>{i.filename}</option>
        )

    const instructionItems = instructions.map(i=>
        <tbody key={i.id}>
                <tr className="border border-gray-300">
                    <td className="border border-gray-300 align-top"><p className="text-center md:w-5">{i.order}{i.order===1 ? <span className="text-base text-red-600">*</span> : <></>}</p></td>
                    <td className="border border-gray-300 md:w-[120%]">
                        <textarea id={"instruction-input-"+i.order} aria-describedby={"instruction-error"+i.id} className="w-[100%] p-1 rounded h-20 resize-none outline outline-1 outline-gray-400 md:resize-y" name="instruction-description" defaultValue={i.description}></textarea>
                        {state!=null && state.errorField==="instructions" && state.index === i.order && <div id={"instruction-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                        <div>
                        <table className="">
                        <tbody>
                            {oriImageList.length>0&&
                            <tr>
                                <td className="align-top"><input defaultChecked={initialInstructionImageSettings[i.order-1]=="existing" ? true : false} type="radio" name={"instruction-image-option-"+i.id} id={"instruction-image-existing-"+i.id} value="existing"></input></td>
                                <td>
                                    <div className="mb-1 flex flex-col sm:flex-row">
                                    <label className="ml-2" htmlFor={"instruction-image-existing-"+i.id}>Choose from existing: </label>
                                    <div className="flex flex-row relative w-[250px] sm:w-[351px] md:w-[452px]">                   
                                    <select name="instruction-image-filename" defaultValue={i.existingImageFileName} className="ml-2 mr-2 max-w-36 outline outline-1 outline-gray-300 px-2 h-8 rounded-md bg-gray-100" onChange={e=>{updateInstructionUrl(i.id, e.target.selectedIndex);}}>
                                        {imageSelectItems}
                                    </select>            
                                    <div>
                                        <input ref={(urlNode)=>{const urlMap=getInstrImageUrlMap(); if(urlNode){urlMap.set(i.id,urlNode);}else urlMap.delete(i.id)}} className="input w-[510px] hidden" name="instruction-image-url" value={i.existingImageUrl ===""? oriImageList[0].url : i.existingImageUrl}></input>
                                        <img ref={(instrImageMiniNode)=>{const instrImageMiniMap=getInstrImageMiniMap(); if(instrImageMiniNode){instrImageMiniMap.set(i.id,instrImageMiniNode);}else instrImageMiniMap.delete(i.id)}} className="h-8 w-12" alt="" src={i.existingImageUrl ===""? oriImageList[0].url : i.existingImageUrl} onMouseEnter={()=>showPopupImage(i.id)} onMouseLeave={()=>hidePopupImage(i.id)}></img>
                                         <div ref={(instrImagePopupNode)=>{const instrImagePopupMap=getInstrImagePopupMap(); if(instrImagePopupNode){instrImagePopupMap.set(i.id,instrImagePopupNode);}else instrImagePopupMap.delete(i.id)}} className="hidden">
                                        <div className=" -translate-x-16 sm:-translate-x-44 md:-translate-x-[270px] absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>
                                        <img alt="" className="-translate-x-44 z-[1] w-[267px] h-[196px] sm:w-[348px] sm:h-[240px] md:w-[450px] md:h-[320px] absolute top-[52px]" src={i.existingImageUrl ===""? oriImageList[0].url : i.existingImageUrl}></img>
                                        </div>
                                    </div>                                    
                                    </div>
                                    </div>
                                </td>
                            </tr>}
                            <tr className="">
                                <td className="align-top"><input className="sm:mt-3" defaultChecked={initialInstructionImageSettings[i.order-1]=="new" ? true : false} type="radio" name={"instruction-image-option-"+i.id} id={"instruction-image-new-"+i.id} value="new"></input></td>
                                <td className="">
                                <div className="mb-1 flex flex-col sm:flex-row">
                                <label className="ml-2 mr-5 sm:mt-2" htmlFor={"description-image-new-"+i.id}>Choose from device: </label>
                                <div className="flex flex-row">
                                <input ref={(node)=>{const map=getInstructionImageInputMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>updateInstructionImage(i.id)} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                                <label htmlFor={"instruction-image-"+i.id} className="ml-2 sm:ml-0 btn "><span className="text-sm">Choose File</span></label>
                                <p className="ml-2 mt-4 mr-2 text-sm max-w-[130px] whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                                {i.fileChosen && <button type="button" className="ml-2 text-red-700 text-3xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                                </div>
                                {i.imageErrorText!="" && <p className="md:hidden ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td className=""><input defaultChecked={i.order>initialInstructionImageSettings.length|| initialInstructionImageSettings[i.order-1]=="none" ? true : false} type="radio" name={"instruction-image-option-"+i.id} id={"instruction-image-none-"+i.id} value="none"></input></td>
                                <td><label className="ml-2" htmlFor={"instruction-image-none-"+i.id}>None</label></td>
                            </tr>
                        </tbody>
                        </table>
                        </div>
                        
                        <div className="flex flex-row float-right md:hidden">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addInstructionBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" disabled = {instructions.length===1&&i.order===1?true:false} onClick={()=>removeInstruction(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" onClick={()=>moveInstructionUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveInstructionDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                        </div>
                    </td>
                    
                    <td className=" hidden border border-gray-300 md:table-cell">
                    <div className="flex flex-row float-right">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addInstructionBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" disabled = {instructions.length===1&&i.order===1?true:false} onClick={()=>removeInstruction(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" onClick={()=>moveInstructionUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveInstructionDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        )

        const noteItems = notes.map(n=>
                    <tbody className="border border-gray-300" key={n.id}><tr className="border border-gray-300">
                        <td className="border border-gray-300 w-5"><p className="text-center">{n.order}</p></td>
                        <td className="border border-gray-300">
                            <textarea id={"note-input-"+n.order} aria-describedby={"notes-error"+n.id} className="w-[100%] p-1 rounded border border-gray-200 outline outline-1 outline-gray-400 md:resize-y" name="notes" defaultValue={n.description}></textarea>
                            {state!=null && state.errorField==="notes" && state.index === n.order && <div id={"notes-error"+n.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                            <div className="flex flex-row items-center float-right">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addNoteBelow(n.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>removeNote(n.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" onClick={()=>moveNoteUp(n.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveNoteDown(n.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                        </div>
                        </td>
                        <td className="hidden border border-gray-300">
                        <div className="flex flex-row items-center">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addNoteBelow(n.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>removeNote(n.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" onClick={()=>moveNoteUp(n.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveNoteDown(n.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                    </div>
                        </td>

                    </tr></tbody>  
            )

            const ingredientItems = ingredients.map(i=>
                <tbody className=" border border-gray-300" key={i.id}><tr className="border border-gray-300">
                                <td className="border border-gray-300 align-top"><p className="md:w-5 text-center">{i.order}{i.order===1 ? <span className="text-base text-red-600">*</span> : <></>}</p></td>
                                <td className=" border border-gray-300 md:w-[120%]">
                                    <textarea id={"ingredient-input-"+i.order} aria-describedby={"ingredient-error"+i.id} className=" w-[100%] p-1 rounded resize-none outline outline-1 outline-gray-400 md:resize-y" name="ingredient-description" placeholder={"Ingredient No. "+i.order} defaultValue={i.description}></textarea>
                                    {state!=null && state.errorField==="ingredients" && state.index === i.order && <div id={"ingredient-error"+i.id} aria-live="polite" aria-atomic="true"><p className=" text-sm text-red-500">{state.message}</p></div>}
                                    <div className="flex flex-row float-right md:hidden">
                                        <button className="btn-sm -mt-1 mr-2" type="button" onClick={() => addIngredientBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                        <button className="btn-sm -mt-1 mr-2" disabled={ingredients.length===1 && i.order===1?true:false} type="button" onClick={() => removeIngredient(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                        <button className="btn-sm mr-2" type="button" onClick={() => moveIngredientUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                        <button className="btn-sm" type="button" onClick={() => moveIngredientDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                                    </div>
                                </td>
                                <td className="hidden border border-gray-300 md:table-cell">
                                    <div className="flex flex-row items-center">
                                        <button className="btn-sm -mt-1 mr-2" type="button" onClick={() => addIngredientBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                        <button className="btn-sm -mt-1 mr-2" disabled={ingredients.length===1 && i.order===1?true:false} type="button" onClick={() => removeIngredient(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                        <button className="btn-sm mr-2" type="button" onClick={() => moveIngredientUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                        <button className="btn-sm" type="button" onClick={() => moveIngredientDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                                    </div>
                                </td>
                    </tr></tbody>
                )

        function getInstrImagePopupMap(){
            if(!instructionImagesPopupRef.current){
                instructionImagesPopupRef.current = new Map()
            }
            return instructionImagesPopupRef.current
        }

        function getInstructionImageInputMap():Map<number,HTMLInputElement>{
            if(!instructionImagesRef.current){
                 instructionImagesRef.current = new Map()
            }
            return instructionImagesRef.current
        }

        function getInstrImageMiniMap():Map<number,HTMLImageElement>{
            if(!instructionImagesMiniRef.current){
                instructionImagesMiniRef.current = new Map()
            }
            return instructionImagesMiniRef.current
        }

        function getInstrImageUrlMap():Map<number, HTMLInputElement>{
            if(!instructionUrlsRef.current){
                instructionUrlsRef.current = new Map()
            }
            return instructionUrlsRef.current
        }


    return(
        <>
            <form className="mb-40 mx-auto w-[97%] border rounded-lg border-gray-400 p-2 lg:max-w-[1100px]" action={async(e)=>{const newState = await updateRecipe(e); if(!newState){return} setState(newState); scrollToError(newState)}}>
                <input className="hidden" name="recipe-uuid" defaultValue={oriRecipe.uuid}></input>
                <div className="hidden">
                    <ol>
                        {imageItems}
                    </ol>
                </div>
                <div className="flex flex-row">
                <label className="label mr-[7px]" htmlFor="title"><span className=" text-base font-bold">Title<span className="text-base text-red-600">*</span></span></label>
                    <input id="title-input" type="text" name="title" aria-describedby="title-error" className="h-10 input w-44 sm:w-96 outline outline-1 outline-gray-400" onChange={(e)=>setTitle(e.target.value)} value={title}/>
                    <div className="relative mt-2">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowTitleTooltip(true)} onMouseLeave={()=>setShowTitleTooltip(false)}></InformationCircleIcon>
                        {showTitleTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showTitleTooltip && <p className=" bg-gray-600 text-white tooltip absolute w-60 z-10 right-1 top-[40px]">The title of your recipe. Try to keep it short, yet descriptive. Press &#8635; icon to revert to original value</p>}
                    </div>
                    <button type="button" className=" ml-1 outline outline-1 outline-gray-300 rounded-sm min-w-8 max-h-8 text-xl my-auto" onClick={resetTitle}>&#8635;</button>
                </div>
                {state!=null && state.errorField==="title" && <div id="title-error" aria-live="polite" aria-atomic="true"><p className="mt-2 ml-14 text-sm text-red-500">{state.message}</p></div>}
                <div className="form-control">
                    <div className="flex flex-row">
                    <label className="label" htmlFor="description"><span className="text-base font-bold">Description<span className="text-base text-red-600">*</span></span></label>
                    <div className="relative mt-2">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowDescriptionTooltip(true)} onMouseLeave={()=>setShowDescriptionTooltip(false)}></InformationCircleIcon>
                        {showDescriptionTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showDescriptionTooltip && <p className=" bg-gray-600 text-white tooltip absolute w-72 translate-x-[-100px] z-[1] top-[40px]">Provide a description of the history of the recipe, the process of making the recipe, what the end result looks like, why it tastes so good, etc. Press &#8635; icon to revert to original value</p>}
                    </div>    
                    <button type="button" className=" ml-1 outline outline-1 outline-gray-300 rounded-sm min-w-8 max-h-8 text-xl my-auto" onClick={resetDescription}>&#8635;</button>
                    </div>
                    <textarea id="description-input" className="p-1 w-[100%] textarea-bordered h-40 outline outline-1 outline-gray-400 rounded md" name="description" aria-describedby="description-error" onChange={e=>setDescription(e.target.value)} value={description}/> {/*w-282px*/}
                </div> 
                {state!=null && state.errorField==="description" && <div id="description-error" aria-live="polite" aria-atomic="true"><p className="mt-2 text-sm text-red-500">{state.message}</p></div>}
                <div className="">
                    <div className="flex flex-row">
                        <label className="label" ><span className="text-base font-bold">Description Image:</span></label>
                        <div className="relative mt-2">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowDescriptionImageTooltip(true)} onMouseLeave={()=>setShowDescriptionImageTooltip(false)}></InformationCircleIcon>
                        {showDescriptionImageTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showDescriptionImageTooltip && <p className=" text-left bg-gray-600 text-white tooltip absolute w-60 sm:w-80 translate-x-[-120px] z-[1] top-[40px]">
                            The main picture of your recipe. Usually the picture of the end result of your recipe. If set, this is the first image a visitor will see on your recipe.
                            <br></br>You can set it to be an image already uploaded previously for this recipe, or upload a new image. Max size 2MB.
                        </p>}
                        </div>
                    </div>

                    <table className=" table-auto">
                        <tbody>
                            {oriImageList.length>0&&
                            <tr>
                                <td className="align-top"><input defaultChecked={initialSetting=="existing" ? true : false} type="radio" name="description-image-option" id="description-image-existing" value="existing"></input></td>
                                <td >
                                    <div className="mb-1 flex flex-col sm:flex-row">
                                    <label className="ml-2" htmlFor="description-image-existing">Choose from existing: </label>
                                    <div className="flex flex-row relative w-[270px] sm:w-[351px] md:w-[452px]">
                                    <select name="description-image-filename" defaultValue={oriDescriptionMedia!==null ? oriDescriptionMedia.filename : "--Select--"} className="ml-2 mr-2 max-w-36 outline outline-1 outline-gray-300 px-2 h-8 rounded-md bg-gray-100" onChange={e=>{setExistingDescriptionImage(oriImageList[e.target.selectedIndex]); setExistingDescriptionImageUrl(oriImageList[e.target.selectedIndex].url);}}>
                                    {imageSelectItems}
                                    </select>
                                    <input className="hidden" name="description-image-url" value={existingDescriptionImageUrl}></input>
                                    <div>
                                        <img className="h-8 w-12" alt="" src={existingDescriptionImage.url} onMouseEnter={()=>setShowEnlargedDescriptionImage(true)} onMouseLeave={()=>setShowEnlargedDescriptionImage(false)}></img>
                                        {showEnlargedDescriptionImage && <div className=" -translate-x-20 sm:-translate-x-44 md:-translate-x-[270px] absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                                        {showEnlargedDescriptionImage && <img alt="" className=" -translate-x-[148px] z-[1] w-[267px] h-[196px] sm:w-[348px] sm:h-[240px] md:w-[450px] md:h-[320px] absolute top-[52px]" src={existingDescriptionImage.url}></img>}
                                    </div>
                                    </div>
                                    </div>
                                </td>
                            </tr>}
                            <tr>
                                <td className="align-top"><input className=" sm:mt-3" defaultChecked={initialSetting=="new" ? true : false} type="radio" name="description-image-option" id="description-image-new" value="new"></input></td>
                                <td className="">
                                <div className="mb-1 flex flex-col sm:flex-row">
                                <label className="ml-2 mr-5 sm:mt-2" htmlFor="description-image-new">Choose from device: </label>
                                <div className="flex flex-row">
                                <input ref={descriptionImageRef} onChange={e=>{if(!descriptionImageRef.current||!descriptionImageRef.current.files){return} setDescriptionImage({name: descriptionImageRef.current.files[0].name, fileChosen: true, buttonText:"Repick Image"}); validateDescriptionImage(descriptionImageRef.current.files[0])}} hidden type="file" name="description-image" id="description-image"/>
                                <label htmlFor="description-image" className="ml-2 sm:ml-0 btn "><span className="text-sm">Choose File</span></label>
                                <p className="ml-2 mt-4 mr-2 text-sm max-w-[130px] whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{descriptionImage.name}</p>
                                {descriptionImage.fileChosen && <button type="button" className=" btn-ghost text-red-700 text-2xl" onClick={()=>{if(!descriptionImageRef.current){return} descriptionImageRef.current.files=null; setDescriptionImage({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})}}>&times;</button>}
                                </div>
                                {descriptionImageError!=="" && <p className="mt-2 ml-1 text-sm text-red-500">{descriptionImageError}</p>}
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td className=""><input defaultChecked={initialSetting=="none" ? true : false} type="radio" name="description-image-option" id="description-image-none" value="none"></input></td>
                                <td><label className="ml-2" htmlFor="description-image-none">None</label></td>
                            </tr>
                        </tbody>
                    </table>                    
                </div> 

                <section className="">
                <div className="flex flex-row">
                    <label className="label mr-3" htmlFor="prep-time"><span className="text-base font-bold">Preperation <br className="md:hidden"></br> Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <div className="flex flex-col">
                    <input id="prep_time-input" onChange={e=>setPrepTime(e.target.value)} value={prepTime} aria-describedby="prep_time-error" type="number" name="prep-time" className="mt-2 w-[118px] input outline outline-1 outline-gray-400"/>{/*w-36 */}
                    {state!=null && state.errorField==="prep_time" && <div id="prep_time-error" aria-live="polite" aria-atomic="true"><p className="text-right text-xs text-red-500">{state.message}</p></div>}
                    </div>
                    <button type="button" className="ml-2 mt-3 outline outline-1 outline-gray-300 rounded-sm min-w-8 h-[40px] text-xl" onClick={resetPrepTime}>&#8635;</button>
                </div> 
                
                <div className=" flex flex-row ">
                    <label className="label mr-3 md:mr-[63px]" htmlFor="cook-time"><span className="text-base font-bold">Cook <br className="md:hidden"></br> Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <div className="flex flex-col">
                    <input id="cook_time-input" onChange={e=>setCookTime(e.target.value)} value={cookTime} aria-describedby="cook_time-error" type="number" name="cook-time" className="mt-2 w-[118px] input outline outline-1 outline-gray-400"/>
                    {state!=null && state.errorField==="cook_time" && <div id="cook_time-error" aria-live="polite" aria-atomic="true"><p className="text-right text-xs text-red-500">{state.message}</p></div>}
                    </div>
                    <button type="button" className=" ml-2 mt-3 outline outline-1 outline-gray-300 rounded-sm min-w-8 h-[40px] text-xl" onClick={resetCookTime}>&#8635;</button>
                </div>
                
                <div className="flex flex-row ">
                    <label className="label mr-14 md:mr-[150px]" htmlFor="servings"><span className=" text-base font-bold">Servings<span className="text-base text-red-600">*</span></span></label>
                    <div className = "flex flex-col">
                    <input id={"servings-input"} onChange={e=>setServings(e.target.value)} value={servings} aria-describedby="servings-error" type="number" name="servings" className=" mt-2 w-[118px] input outline outline-1 outline-gray-400"/>
                    {state!=null && state.errorField==="servings" && <div id="servings-error" aria-live="polite" aria-atomic="true"><p className="text-right text-xs mt-1 text-red-500">{state.message}</p></div>}
                    </div>
                    <button type="button" className=" ml-2 mt-3 outline outline-1 outline-gray-300 rounded-sm min-w-8 h-[40px] text-xl my-auto" onClick={resetServings}>&#8635;</button>
                </div>          
                </section>

                <div className="pt-2 border rounded-md border-gray-300 mt-2 flex flex-col">
                    <div className=" flex flex-row">
                    <label className="label" htmlFor="ingredients"><span className="text-base font-bold">Ingredients<span className="text-base text-red-600">*</span></span></label>
                    <div className="relative mt-3">
                    <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowIngredientTooltip(true)} onMouseLeave={()=>setShowIngredientTooltip(false)}></InformationCircleIcon>
                    {showIngredientTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                    {showIngredientTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-40 z-[1] top-[40px]"><span>The ingredients required.<br></br>
                        Add: Adds ingredient to bottom of the list<br></br>
                        &#8635; Icon: Reverts ingredient list to original<br></br>
                        + Icon: Adds ingredient below<br></br>
                        x Icon: Removes the ingredient<br></br>
                        &uarr; Icon: Shifts ingredient up<br></br>
                        &darr; Icon: Shifts ingredient down</span></p>}
                    </div>
                    <button type="button" className="ml-1 px-4 w-20 mr-1 btn bg-gray-100" onClick={addIngredient}>Add</button>
                    <button type="button" className=" ml-1 outline outline-1 outline-gray-300 rounded-sm min-w-8 max-h-8 text-xl my-auto" onClick={resetIngredients}>&#8635;</button>
                    </div>

                    <table className="table-auto w-[100%] mt-3 border border-gray-300">{/*w-280px */}
                        <thead className="">
                        <tr className="border border-gray-300">
                            <th className="hidden border border-gray-300 md:table-cell"></th>
                            <th className="hidden border border-gray-300 md:table-cell"><span className="text-base font-bold">Ingredient</span></th>
                            <th className="hidden border border-gray-300 md:table-cell">
                            <div className="flex flex-row ml-[25%]">
                                <div>Actions</div>
                                <div className="relative">
                    <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowIngredientActionsTooltip(true)} onMouseLeave={()=>setShowIngredientActionsTooltip(false)}></InformationCircleIcon>
                    {showIngredientActionsTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                    {showIngredientActionsTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-4 z-[1] top-[40px]"><span>       
                        + Icon: Adds ingredient below<br></br>
                        x Icon: Removes the ingredient<br></br>
                        &uarr; Icon: Shifts ingredient up<br></br>
                        &darr; Icon: Shifts ingredient down</span></p>}
                    </div>
                    </div>
                            </th>
                        </tr>
                        </thead>
                        {ingredientItems}
                    </table>
                </div>

                <div className="pt-2 border rounded-md border-gray-300 mt-2 form-control">
                    <div className="mt-3 flex flex-row">
                    <label className="label" htmlFor="instructions"><span className="text-base font-bold">Instructions<span className="text-base text-red-600">*</span></span></label>
                    <div className="relative mt-3">
                    <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowInstructionTooltip(true)} onMouseLeave={()=>setShowInstructionTooltip(false)}></InformationCircleIcon>
                    {showInstructionTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                    {showInstructionTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-40 z-[1] top-[40px]"><span>The instructions for making your recipe.<br></br>
                        Add Instruction: Adds instruction to bottom of the list<br></br>
                        + Icon: Adds instruction below<br></br>
                        x Icon: Removes the instruction<br></br>
                        &uarr; Icon: Shifts instruction up<br></br>
                        &darr; Icon: Shifts instruction down<br></br>
                        You may attach one image, max. size 2MB to each instruction</span></p>}
                    </div>
                    <button type="button" className="ml-1 px-4 w-20 mr-1 btn bg-gray-100" onClick={addInstruction}>Add</button>
                    <button type="button" className=" ml-1 outline outline-1 outline-gray-300 rounded-sm min-w-8 max-h-8 text-xl my-auto" onClick={resetInstructions}>&#8635;</button>
                    </div>

                    <table className="table-auto w-[100%] mt-3 border border-gray-300">
                        <thead>
                        <tr className="border border-gray-300">
                            <th className="hidden border border-gray-300 md:table-cell"></th>
                            <th className="hidden border border-gray-300 md:table-cell"><span className="text-lg font-bold">Instruction</span></th>
                            <th className="hidden border border-gray-300 md:table-cell">
                            <div className="flex flex-row ml-[25%]">
                                <div>Actions</div>
                                <div className="relative">
                                <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowInstructionActionsTooltip(true)} onMouseLeave={()=>setShowInstructionActionsTooltip(false)}></InformationCircleIcon>
                                {showInstructionActionsTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                                {showInstructionActionsTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-4 z-[1] top-[40px]"><span>          
                                + Icon: Adds instruction below<br></br>
                                x Icon: Removes the instruction<br></br>
                                &uarr; Icon: Shifts instruction up<br></br>
                                &darr; Icon: Shifts instruction down</span></p>}
                    </div>
                    </div>
                            </th>
                        </tr>
                        </thead>
                        {instructionItems}
                    </table>
                </div>
                <div className=" p-1 border rounded-md border-gray-200 mt-3 flex flex-col">
                    <div className="flex flex-row">
                    <label className="label mr-3" htmlFor="notes"><span className="text-base font-bold">Notes</span></label>
                    <div className="relative mt-3">
                    <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowNotesTooltip(true)} onMouseLeave={()=>setShowNotesTooltip(false)}></InformationCircleIcon>
                    {showNotesTooltip && <div className=" absolute right-2 bottom-8 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-t-[20px] border-t-gray-600"></div>}
                    {showNotesTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-14 z-[1] bottom-[50px]"><span>Any additional tips you didn&apos;t include in ingredients or instructions.<br></br>
                        Add Note: Adds note to bottom of the list<br></br>
                        + Icon: Adds note below<br></br>
                        x Icon: Removes the note<br></br>
                        &uarr; Icon: Shifts note up<br></br>
                        &darr; Icon: Shifts note down</span></p>}
                    </div>
                    <button type="button" className=" w-36 btn" onClick={addNote}>Add Note</button>
                    <button type="button" className=" ml-1 outline outline-1 outline-gray-300 rounded-sm min-w-8 max-h-8 text-xl my-auto" onClick={resetNotes}>&#8635;</button>
                    </div>
                    <table className="table-auto w-[100%] mt-3 border border-gray-300">
                        <thead>
                            <tr className="border border-gray-300">
                            <th className="hidden border border-gray-300"></th><th className="hidden border border-gray-300"><span className="text-lg font-bold">Note</span></th><th className="hidden border border-gray-300"></th>
                            </tr>
                        </thead>
                        {noteItems}
                    </table>
                </div>
                <div className="flex flex-row">
                    <label className="label mr-[7px]" htmlFor="accessibility"><span className=" text-base font-bold">Accessibility<span className="text-base text-red-600">*</span></span></label>
                    <div className="flex flex-col mt-6">
                    <div className="flex flex-row">
                        <input type="radio" name="accessibility" id="private" value="private" className="mr-2"/><label className=" mt-0.5" htmlFor="private">Private</label>
                        <div className="relative mt-1">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowPrivateTooltip(true)} onMouseLeave={()=>setShowPrivateTooltip(false)}></InformationCircleIcon>
                        {showPrivateTooltip && <div className=" absolute right-2 bottom-5 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-t-[20px] border-t-gray-600"></div>}
                        {showPrivateTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-20 z-[1] bottom-[40px]">Private: Only you can view and modify</p>}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <input defaultChecked type="radio" name="accessibility" id="public" value="public" className="mr-2"/><label className="mt-0.5" htmlFor="public">Public</label>
                        <div className="relative mt-1">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowPublicTooltip(true)} onMouseLeave={()=>setShowPublicTooltip(false)}></InformationCircleIcon>
                        {showPublicTooltip && <div className=" absolute right-2 bottom-5 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-t-[20px] border-t-gray-600"></div>}
                        {showPublicTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-20 z-[1] bottom-[40px]">Public: Anyone with the link can view, but only you can modify</p>}
                        </div>
                    </div>
                    </div>
                </div>
                <div className="mt-3 mb-7 flex flex-row-reverse">
                <SubmitButton></SubmitButton>
                </div>
            </form>
        </>

    )
}