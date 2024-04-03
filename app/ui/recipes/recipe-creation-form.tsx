'use client'
import { MutableRefObject, useState } from "react"
import { useRef } from "react"
import { createNewRecipe, redirectToLogin } from "@/app/lib/actions"
import ValidateImage from "@/app/lib/validators/ImageValidator"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import {ArrowUpIcon} from "@heroicons/react/24/outline"
import {ArrowDownIcon} from "@heroicons/react/24/outline"
import { useFormStatus } from "react-dom"
import { FormError } from "@/app/lib/definitions"
import { any } from "zod"


const units = [
     {id: 0, name: "Pieces(pcs)"},
     {id: 1, name: "Gram(g)"},
     {id: 2, name: "Kilogram(kg)"},
     {id: 3, name: "Ounce(oz)"},
     {id: 4, name: "Pound(lb)"},
     {id: 5, name: "Teaspoon(tsp)"},
     {id: 6, name: "Tablespoon(tbsp)"},
     {id: 7, name: "Milliliter(ml)"},
     {id: 8, name: "Litre(L)"},
     {id: 9, name: "Fluid ounce (fl oz)"},
     {id: 10, name: "Cup"},
     {id: 11, name: "Pint"},
     {id: 12, name: "Quart"},
     {id: 13, name: "Gallon"}
]

let ingredientCount=0
let instructionCount=0
let notesCount=0

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

export default function Form(){  
    const initialState = {errorField:null, message:null, index:null}
    //const [state, dispatch] = useFormState(createNewRecipe, initialState)
    const [state, setState] = useState<FormError>(initialState)
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

    const descriptionImageRef = useRef<HTMLInputElement>(null)
    const instructionImagesRef = useRef<Map<number, HTMLInputElement>|null>(null)

    const [descriptionImageError, setDescriptionImageError] = useState("")
    const [ingredients, setIngredients] = useState<({ id: number; description: string; order: number; }[])>([{id: 0, description: "", order:1}])
    const [instructions, setInstructions] = useState([{id: 0, description: "", order:1, imageFileName:"No file chosen", fileChosen: false, imageButtonText: "Choose Image", imageErrorText: ""}])
    const [notes, setNotes] = useState<{id:number,order:number,description:string}[]>([])
    const [descriptionImage, setDescriptionImage] = useState({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})

    function SubmitButton(){
        const status = useFormStatus()
        return <button className="btn btn-md min-w-24 bg-green-400">{status.pending ? (<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>):(<span>Create</span>)}</button>  
    }
    
    const instructionItems = instructions.map(i=>
        {if(i.order===1&&instructions.length===1){
            return(<tbody className=" border border-gray-300" key={i.id}>
                <tr className=" border border-gray-300">
                    <td className="border border-gray-300 w-5"><p className=" text-center">{i.order}{i.order===1 ? <span className="text-base text-red-600">*</span> : <></>}</p></td>
                    <td className="border border-gray-300 md:[w-120%]">
                        <textarea id={"instruction-input-"+i.order} aria-describedby={"instruction-error"+i.id} className="w-[100%] p-1 rounded h-20 outline outline-1 outline-gray-400 md:resize-y" name="instruction-description" placeholder={"Instruction No. "+i.order}></textarea>     
                        {state!=null && state.errorField==="instructions" && state.index === i.order && <div id={"instruction-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                        <div className="flex flex-row md:mb-1">
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm max-w-[130px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 mb-3 text-red-700 text-2xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                        {i.imageErrorText!="" && <p className="md:hidden mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                        <div className="flex flex-row float-right md:hidden">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addInstructionBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" disabled onClick={()=>removeInstruction(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" disabled onClick={()=>moveInstructionUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveInstructionDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                        </div>
                    </td>
                    <td className="hidden border border-gray-300 w-[260px]">
                        <div className="w-[100px] flex flex-row">
                        <input ref={(node:HTMLInputElement)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>{updateInstructionImage(i.id);}} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm min-w-[100px] max-w-[100px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 mb-2 text-red-700 text-2xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                        {i.imageErrorText!="" && <p className="mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                    </td>
                    <td className="hidden border border-gray-300 md:table-cell w-[80px]">
                    <div className="flex flex-row float-right">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addInstructionBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" disabled onClick={()=>removeInstruction(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" disabled onClick={()=>moveInstructionUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveInstructionDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                        </div>
                    </td>
                </tr>
            </tbody>)
        }else{
            return(<tbody key={i.id}>
                <tr className="border border-gray-300">
                    <td className="border border-gray-300 w-5"><p className="text-center">{i.order}{i.order===1 ? <span className="text-base text-red-600">*</span> : <></>}</p></td>
                    <td className="border border-gray-300 md:[w-120%]">
                        
                        <textarea id={"instruction-input-"+i.order} aria-describedby={"instruction-error"+i.id} className="w-[100%] p-1 rounded h-20 outline outline-1 outline-gray-400 md:resize-y" name="instruction-description" placeholder={"Instruction No. "+i.order}></textarea>
                        {state!=null && state.errorField==="instructions" && state.index === i.order && <div id={"instruction-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                        <div className="flex flex-row md:mb-1">
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm max-w-[130px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 mb-3 text-red-700 text-2xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                        {i.imageErrorText!="" && <p className="md:hidden mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                        <div className="flex flex-row float-right md:hidden">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addInstructionBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>removeInstruction(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" onClick={()=>moveInstructionUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveInstructionDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                        </div>
                    </td>
                    <td className="hidden border border-gray-300 w-[260px]">
                    <div className="w-[100px] flex flex-row">
                        <input ref={(node:HTMLInputElement)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>updateInstructionImage(i.id)} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm min-w-[100px] max-w-[100px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 text-red-700 text-3xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                    </div>
                    {i.imageErrorText!="" && <p className="mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                    </td>
                    <td className=" hidden border border-gray-300 md:table-cell w-[80px]">
                    <div className="flex flex-row float-right">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addInstructionBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>removeInstruction(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" onClick={()=>moveInstructionUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveInstructionDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                    </div>
                    </td>
                </tr>
            </tbody>)
        }
        }
        )


    const noteItems = notes.map(n=>          
                <tbody className="border border-gray-300" key={n.id}><tr className="border border-gray-300">
                    <td className="border border-gray-300 w-5"><p className="text-center">{n.order}</p></td>
                    <td className="border border-gray-300">
                        <textarea id={"note-input-"+n.order} aria-describedby={"notes-error"+n.id} className="w-[100%] p-1 rounded border border-gray-200 outline outline-1 outline-gray-400 md:resize-y" name="notes"></textarea>
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
        {if(i.order===1 && ingredients.length===1){

            return  ( <tbody className=" border border-gray-300" key={i.id}><tr className="border border-gray-300">
                        <td className="border border-gray-300 min-w-5"><p className=" text-center">{i.order}{i.order===1 ? <span className="text-base text-red-600">*</span> : <></>}</p></td>
                        <td className=" border border-gray-300 md:w-[120%]">
                            <textarea id={"ingredient-input-"+i.order} aria-describedby={"ingredient-error"+i.id} className=" w-[100%] p-1 resize-none outline outline-1 outline-gray-400 rounded md:resize-y" name="ingredient-description" placeholder={"Ingredient No. "+i.order}></textarea>{/*w-264px */}
                            {state!=null && state.errorField==="ingredients" && state.index === i.order && <div id={"ingredient-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                            <div className="flex flex-row float-right md:hidden">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addIngredientBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" disabled><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" disabled><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveIngredientDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                            </div>
                        </td>
                        <td className="hidden border border-gray-300 md:table-cell">
                            <div className="flex flex-row items-center">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addIngredientBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" disabled><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" disabled><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveIngredientDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                            </div> 
                        </td>
                    </tr></tbody>)
        }else{
            return (<tbody className=" border border-gray-300" key={i.id}><tr className="border border-gray-300">
                        <td className="border border-gray-300 min-w-5"><p className="md:w-5 text-center">{i.order}{i.order===1 ? <span className="text-base text-red-600">*</span> : <></>}</p></td>
                        <td className=" border border-gray-300 md:w-[120%]">
                            <textarea id={"ingredient-input-"+i.order} aria-describedby={"ingredient-error"+i.id} className=" w-[100%] p-1 rounded resize-none outline outline-1 outline-gray-400 md:resize-y" name="ingredient-description" placeholder={"Ingredient No. "+i.order}></textarea>
                            {state!=null && state.errorField==="ingredients" && state.index === i.order && <div id={"ingredient-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                            <div className="flex flex-row float-right md:hidden">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addIngredientBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>removeIngredient(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" onClick={()=>moveIngredientUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveIngredientDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                            </div>
                        </td>
                        <td className="hidden border border-gray-300 md:table-cell">
                        <div className="flex flex-row items-center">
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>addIngredientBelow(i.id)}><p className="text-green-500 text-2xl">+</p></button>
                                <button className="btn-sm -mt-1 mr-2" type="button" onClick={()=>removeIngredient(i.id)}><p className="text-red-500 text-2xl">&times;</p></button>
                                <button className="btn-sm mr-2" type="button" onClick={()=>moveIngredientUp(i.id)}><ArrowUpIcon className="w-4"></ArrowUpIcon></button>
                                <button className="btn-sm" type="button" onClick={()=>moveIngredientDown(i.id)}><ArrowDownIcon className="w-4"></ArrowDownIcon></button>
                            </div>
                        </td>
            </tr></tbody>)
        }}
        )

    function ValidateDescriptionImage(file:File){
        const error = ValidateImage(file)
        if(error){
            if(!descriptionImageRef.current){
                return
            }
            descriptionImageRef.current.files=null;
            setDescriptionImage({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})
            setDescriptionImageError(error.message)
        }else{
            setDescriptionImageError("")
        }

    }

    function getMap():Map<number,HTMLInputElement> {
        if(!instructionImagesRef.current){
            instructionImagesRef.current = new Map<number, HTMLInputElement>()
        }
        return instructionImagesRef.current
    }


    function removeInstructionImageFile(id:number){
        const map = getMap();
        const node = map.get(id);
        if(!node){
            return
        }
        node.files = null;
        const nextInstructions = instructions.map(i=>{
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

    function updateInstructionImage(id:number){
        const map = getMap();
        const node = map.get(id);
        if(!node||!node.files){
            return
        }
        
        const error = ValidateImage(node.files[0])

        if(!error){
         const nextInstructions = instructions.map(i=>{
            
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
            const nextInstructions = instructions.map(i=>{
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

    function addNote(){
        notesCount++;
        setNotes([
            ...notes,
            {id: notesCount, description:"",order:notes.length+1}
        ])
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

    function addIngredient(){
        ingredientCount++;
        setIngredients([
            ...ingredients,
            {id: ingredientCount, description: "", order: ingredients.length+1}
        ])
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

    function moveIngredientDown(Id:number){
        //let ingredientToMoveDown:{ id: number; description: string; order: number; };
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
        const nextNotes = [...notes]
        if(!noteAbove){
            return
        }
        nextNotes[noteToMoveUp.order-1] = noteAbove
        nextNotes[noteAbove.order-1] = noteToMoveUp
        for(let j=0; j<nextNotes.length; j++){
            nextNotes[j].order = j+1
        }
        setNotes(nextNotes)
    }

    function addInstruction(){
        instructionCount++;
        setInstructions([
            ...instructions,
            {id: instructionCount, description:"", order: instructions.length+1, imageFileName:"No file chosen", imageButtonText:"Choose Image",fileChosen: false,imageErrorText:""}
        ])

    }

    function addInstructionBelow(Id:number){
        const indexToAddBelow = instructions.findIndex(({id})=>id===Id)
        instructionCount++
        const nextInstructions = [...instructions.slice(0, indexToAddBelow+1),
            {id: instructionCount, description:"", order: instructions.length+1, imageFileName:"No file chosen", imageButtonText:"Choose Image",fileChosen: false,imageErrorText:""},
        ...instructions.slice(indexToAddBelow+1)]

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
        const nextInstructions = [...instructions]
        if(!instructionBelow){
            return
        }
        nextInstructions[instructionToMoveDown.order-1] = instructionBelow
        nextInstructions[instructionBelow.order-1] = instructionToMoveDown
        //reorder based on array index
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


    function removeInstruction(id:number){
        const copy = [...instructions]
        const afterRemovedInstruction = copy.filter(i=>
            i.id!=id
            )
            //reorder based on array index
            for(let j=0; j<afterRemovedInstruction.length; j++){
                afterRemovedInstruction[j].order = j+1
            }
        setInstructions(afterRemovedInstruction)
    }

    function ErrorNote(){
        if(state===null){
            return null
        }
        if(state.errorField==="title"){
            return <div className="float-right"><p className="text-red-500">Invalid input detected. Please check your title.</p></div>
        }
    }

    

    return(
        <>
            <h1 id="page-title" className=" mb-3 text-center text-2xl font-bold">Create your recipe</h1>
            <form className="mb-40 mx-auto w-[97%] border rounded-lg border-gray-400 p-2 lg:max-w-[1100px]" action={async(e)=>{const newState = await createNewRecipe(e); if(!newState){return} setState(newState); scrollToError(newState)}}>{/*w-300px*/}
                <div className="flex flex-row">
                    <label id="title-label" className="label mr-[7px]" htmlFor="title"><span className=" text-base font-bold">Title<span className="text-base text-red-600">*</span></span></label>
                    <input id="title-input" type="text" name="title" aria-describedby="title-error" className="h-10 input w-96 outline outline-1 outline-gray-400"/>
                    <div className="relative mt-2">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowTitleTooltip(true)} onMouseLeave={()=>setShowTitleTooltip(false)}></InformationCircleIcon>
                        {showTitleTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showTitleTooltip && <p className=" bg-gray-600 text-white tooltip absolute w-60 z-10 right-1 top-[40px]">The title of your recipe. Try to keep it short, yet descriptive.</p>}
                    </div>
                </div>
                {state!=null && state.errorField==="title" && <div id="title-error" aria-live="polite" aria-atomic="true"><p className="mt-2 ml-14 text-sm text-red-500">{state.message}</p></div>}
                <div className="form-control">
                    <div className="flex flex-row">
                    <label className="label" htmlFor="description"><span className="text-base font-bold">Description<span className="text-base text-red-600">*</span></span></label>
                    <div className="relative mt-2">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowDescriptionTooltip(true)} onMouseLeave={()=>setShowDescriptionTooltip(false)}></InformationCircleIcon>
                        {showDescriptionTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showDescriptionTooltip && <p className=" bg-gray-600 text-white tooltip absolute w-72 translate-x-[-100px] z-[1] top-[40px]">Provide a description of the history of the recipe, the process of making the recipe, what the end result looks like, why it tastes so good, etc.</p>}
                    </div>
                    </div>
                    <textarea id="description-input" className="p-1 w-[100%] textarea-bordered h-40 outline outline-1 outline-gray-400 rounded-md" name="description" aria-describedby="description-error"/> {/*w-282px*/}
                </div>
                {state!=null && state.errorField==="description" && <div id="description-error" aria-live="polite" aria-atomic="true"><p className="mt-2 text-sm text-red-500">{state.message}</p></div>}
                <div className="">
                    <div className="flex flex-row">
                    <label className="label" ><span className="text-base font-bold">Description Image:</span></label>
                    <div className="relative mt-2">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowDescriptionImageTooltip(true)} onMouseLeave={()=>setShowDescriptionImageTooltip(false)}></InformationCircleIcon>
                        {showDescriptionImageTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showDescriptionImageTooltip && <p className=" bg-gray-600 text-white tooltip absolute w-60 translate-x-[-120px] z-[1] top-[40px]">The main picture of your recipe. Usually the picture of the end result of your recipe. If set, this is the first image a visitor will see on your recipe.</p>}
                    </div>
                    </div>
                    <div className="flex flex-row">
                    <input ref={descriptionImageRef} onChange={e=>{if(!descriptionImageRef.current||!descriptionImageRef.current.files){return}; setDescriptionImage({name: descriptionImageRef.current.files[0].name, fileChosen: true, buttonText:"Repick Image"}); ValidateDescriptionImage(descriptionImageRef.current.files[0])}} hidden type="file" name="description-image" id="description-image"/>
                    <label htmlFor="description-image" className="relative btn"><span className="text-sm">{descriptionImage.buttonText}</span></label>
                    <p className="ml-2 mt-4 mr-2 text-sm max-w-[130px] whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{descriptionImage.name}</p>
                    {descriptionImage.fileChosen && <button type="button" className=" btn-ghost text-red-700 text-2xl" onClick={()=>{if(!descriptionImageRef.current||!descriptionImageRef.current.files){return}; descriptionImageRef.current.files=null; setDescriptionImage({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})}}>&times;</button>}
                    </div>
                    {descriptionImageError!=="" && <p className="mt-2 ml-1 text-sm text-red-500">{descriptionImageError}</p>}
                </div>

                {/* <section className="flex flex-col sm:flex-row"> */}

                <section className=" lg:flex lg:flex-row lg:content-between">
                <div className="flex flex-row">
                    <label className="label mr-3" htmlFor="prep-time"><span className="text-base font-bold">Preperation <br className="md:hidden"></br> Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <div className="flex flex-col">
                    <input id="prep_time-input" aria-describedby="prep_time-error" type="number" name="prep-time" className="mt-2 w-36 input outline outline-1 outline-gray-400"/>{/*w-36 */}
                    {state!=null && state.errorField==="prep_time" && <div id="prep_time-error" aria-live="polite" aria-atomic="true"><p className="text-right text-xs text-red-500">{state.message}</p></div>}
                    </div>
                </div>
                
                <div className=" flex flex-row ">
                    <label className="label mr-3 md:mr-[63px] lg:mr-3 lg:ml-3" htmlFor="cook-time"><span className="text-base font-bold">Cook <br className="md:hidden"></br> Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <div className="flex flex-col">
                    <input id="cook_time-input" aria-describedby="cook_time-error" type="number" name="cook-time" className="mt-2 w-36 input outline outline-1 outline-gray-400"/>
                    {state!=null && state.errorField==="cook_time" && <div id="cook_time-error" aria-live="polite" aria-atomic="true"><p className="text-right text-xs text-red-500">{state.message}</p></div>}
                    </div>
                </div>
                
                <div className="mt-2 flex flex-row lg:float-right">
                    <label className="label mr-14 md:mr-[150px] lg:mr-3 lg:ml-3" htmlFor="servings"><span className=" text-base font-bold">Servings<span className="text-base text-red-600">*</span></span></label>
                    <div>
                    <input id="servings-input" aria-describedby="servings-error" type="number" name="servings" className=" w-36 input outline outline-1 outline-gray-400"/>
                    {state!=null && state.errorField==="servings" && <div id="servings-error" aria-live="polite" aria-atomic="true"><p className="text-right text-xs mt-1 text-red-500">{state.message}</p></div>}
                    </div>
                </div>
                
                </section>
                {/* </section> */}

                <div className="pt-2 border rounded-md border-gray-300 mt-2 flex flex-col">
                    <div className=" flex flex-row">
                    <label className="label" htmlFor="ingredients"><span className="text-base font-bold">Ingredients<span className="text-base text-red-600">*</span></span></label>
                    <button type="button" className="ml-2 w-36 btn bg-gray-100" onClick={addIngredient}>Add Ingredient</button>
                    <div className="relative mt-3">
                    <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowIngredientTooltip(true)} onMouseLeave={()=>setShowIngredientTooltip(false)}></InformationCircleIcon>
                    {showIngredientTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                    {showIngredientTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-4 z-[1] top-[40px]"><span>The ingredients required.<br></br>
                        Add Ingredient: Adds ingredient to bottom of the list<br></br>
                        + Icon: Adds ingredient below<br></br>
                        x Icon: Removes the ingredient<br></br>
                        &uarr; Icon: Shifts ingredient up<br></br>
                        &darr; Icon: Shifts ingredient down</span></p>}
                    </div>
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
                    <button type="button" className="ml-2 w-36 btn bg-gray-100" onClick={addInstruction}>Add Instruction</button>
                    <div className="relative mt-3">
                    <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowInstructionTooltip(true)} onMouseLeave={()=>setShowInstructionTooltip(false)}></InformationCircleIcon>
                    {showInstructionTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                    {showInstructionTooltip && <p className="text-left p-1 bg-gray-600 text-white tooltip absolute w-72 right-1 translate-x-4 z-[1] top-[40px]"><span>The instructions for making your recipe.<br></br>
                        Add Instruction: Adds instruction to bottom of the list<br></br>
                        + Icon: Adds instruction below<br></br>
                        x Icon: Removes the instruction<br></br>
                        &uarr; Icon: Shifts instruction up<br></br>
                        &darr; Icon: Shifts instruction down<br></br>
                        You may attach one image, max. size 7MB to each instruction</span></p>}
                    </div>
                    </div>

                    <table className="table-auto w-[100%] mt-3 border border-gray-300">
                        <thead>
                        <tr className="border border-gray-300">
                            <th className="hidden border border-gray-300 md:table-cell"></th><th className="hidden border border-gray-300 md:table-cell"><span className="text-base font-bold">Instruction</span></th><th className="hidden border border-gray-300"><span className="text-lg font-bold">Image</span></th>
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
                    <button type="button" className=" w-36 btn" onClick={addNote}>Add Note</button>
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
                <div className="mt-3 mb-1 flex flex-row-reverse">
                {/* <button className="btn ml-3 bg-red-600">{!status.pending ? "Create" : "Creating..."}</button> */}
                {/* <button type="button" className="btn bg-orange-400">Preview</button> */}
                <SubmitButton></SubmitButton>
                </div>
                <div className=" min-h-12">
                
                </div>
            </form>
        </>
    )
}