'use client'
import { useFormState } from "react-dom"
import { useRef } from "react"
import { useState } from "react"
import { updateRecipe } from "@/app/lib/actions"
import ValidateImage from "@/app/lib/validators/ImageValidator"
let ingredientCount=0
let instructionCount=0
let notesCount=0
let imagesCount=0

function ValidateDescriptionImage(file){
    
}

export default function RecipeEditPage({recipeData}){
    let initialSetting = "none"
    let initialDescriptionImage = {}

    let initialInstructionImageSettings = []
    let initialInstructionImages = []
    
    const oriRecipe = recipeData.recipe
    const oriDescriptionMedia = recipeData.recipe_description_media
    const oriTitle = oriRecipe.title
    const oriDescription = oriRecipe.description
    const oriPrepTime = oriRecipe.prep_Time_Mins
    const oriCookTime = oriRecipe.cook_Time_Mins
    const oriServings = oriRecipe.servings

    const oriIngredients = oriRecipe.ingredients
    function compareIngredientsBySequence(a,b){
        return a.ingredient_Number - b.ingredient_Number
    }
    oriIngredients.sort(compareIngredientsBySequence)
    const oriIngredientsList = []
    //remove fields not to be stored in React state
    oriIngredients.forEach(ingredient => {
        oriIngredientsList.push({id:ingredientCount,order:ingredient.ingredient_Number, description:ingredient.description})
        ingredientCount++
    });

    const oriInstructions = oriRecipe.instructions
    function compareInstructionsBySequence(a,b){
        return a.sequence_Number - b.sequence_Number
    }
    oriInstructions.sort(compareInstructionsBySequence)
    const oriInstructionsList = []
    oriInstructions.forEach(instruction => {
        if(instruction.images.length>0){
            initialInstructionImageSettings.push("existing")       
            initialInstructionImages.push({filename:instruction.images[0].filename, url:instruction.images[0].url})
            oriInstructionsList.push({id:instructionCount,order:instruction.sequence_Number, description:instruction.description, imageFileName:instruction.images[0].filename, fileChosen: true, imageButtonText: "Repick Image", imageErrorText: ""})
            instructionCount++
        }else{
            initialInstructionImageSettings.push("none")
            initialInstructionImages.push({filename:"", url:""})
            oriInstructionsList.push({id:instructionCount,order:instruction.sequence_Number, description:instruction.description, imageFileName:"No file chosen", fileChosen: false, imageButtonText: "Choose Image", imageErrorText: ""})
            instructionCount++
        }
    });
    console.log(JSON.stringify(initialInstructionImages))


    const oriNotes = oriRecipe.notes
    function compareNotesBySequence(a,b){
        return a.note_Number - b.note_Number
    }
    oriNotes.sort(compareNotesBySequence)
    const oriNotesList = []
    //remove fields not to be stored in React state
    oriNotes.forEach(note => {
        notesCount++
        oriNotesList.push({id:notesCount,order:note.note_Number, description:note.description})
    });

    const oriImageList = []
    if(oriDescriptionMedia){
        initialSetting="existing"
        initialDescriptionImage = oriDescriptionMedia
        imagesCount++
        oriImageList.push({id:imagesCount, filename: oriDescriptionMedia.filename, url: oriDescriptionMedia.url})
    }
    oriInstructions.forEach(instruction => {
        if(instruction.images.length>0){
            imagesCount++
            oriImageList.push({id:imagesCount, filename:instruction.images[0].filename, url: instruction.images[0].url})
        }
    });


    function resetTitle(){
        setTitle(oriTitle)
    }

    function resetDescription(){
        setDescription(oriDescription)
    }

    function resetPrepTime(){
        setPrepTime(oriPrepTime)
    }

    function resetCookTime(){
        setCookTime(oriCookTime)
    }

    function resetServings(){
        setServings(oriServings)
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

    function removeIngredient(id){
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
            {id: instructionCount, description:"", order: instructions.length+1, imageFileName:"No file chosen", imageButtonText:"Choose Image",fileChosen: false}
        ])
    }

    function removeInstruction(id){
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

    function removeInstructionImageFile(id){
        const map = getMap();
        const node = map.get(id);
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

    function removeNote(id){
        const copy = [...notes]
        const nextNotes = copy.filter(i=>
            i.id!=id
            )
            //reorder based on array index
            for(let j=0; j<notes.length-1; j++){
                nextNotes[j].order = j+1
            }
        setNotes(nextNotes)
    }

    function updateInstructionUrl(id, imageIndex){
        const urlMap = getUrlMap();
        const node = urlMap.get(id);
        node.value = oriImageList[imageIndex].url
        console.log("node: "+node)
        console.log("node value "+node.value)
    }

    function updateInstructionImage(id){
        const map = getMap();
        const node = map.get(id);
        let nextInstructions;
        const error = ValidateImage(node.files[0])

        if(!error){
         nextInstructions = instructions.map(i=>{
            if(i.id === id){
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
        }else{
            nextInstructions = instructions.map(i=>{
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
        }

        setInstructions(nextInstructions)
    }

    const initialState = {errorField:null, message:null, index:null}
    const [state,dispatch] = useFormState(updateRecipe, initialState)

    const [existingDescriptionImage, setExistingDescriptionImage] = useState(initialDescriptionImage)

    const descriptionImageRef = useRef(null)
    const instructionImagesRef = useRef(null)
    const instructionUrlsRef = useRef(null)

    const [title, setTitle] = useState(oriTitle)
    const [description, setDescription] = useState(oriDescription)
    const [prepTime, setPrepTime] = useState(oriPrepTime)
    const [cookTime, setCookTime] = useState(oriCookTime)
    const [servings, setServings] = useState(oriServings)

    const [descriptionImageError, setDescriptionImageError]=useState("")
    const [descriptionImage, setDescriptionImage] = useState({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})
    const [ingredients, setIngredients] = useState(oriIngredientsList)
    const [instructions, setInstructions] = useState(oriInstructionsList)
    const [notes, setNotes] = useState(oriNotesList)

    const [images, setImages] = useState(oriImageList)

    const imageItems = images.map(i=>
        <li className="flex flex-row" key={i.id}>{i.filename+": "}<img src={i.url} alt="" width={20} height={20}></img></li>
    )

    const imageSelectItems = images.map(i=>
        <option className=" flex flex-row" key={i.id} value={i.filename}>{i.filename+": "}</option>
        )

    const instructionItems = instructions.map(i=>
        {if(i.id===0){
            return(<tbody className=" border border-gray-300" key={i.id}>
                <tr className=" border border-gray-300">
                    <td className="border border-gray-300"><p className=" text-center">{i.order}</p></td>
                    <td className="border border-gray-300 md:[w-100%]">
                        <p className="md:hidden">Instruction:</p>
                        <textarea aria-describedby={"instruction-error"+i.id} className="w-[100%] p-1 rounded h-20" name="instruction-description" placeholder="Your first instruction" defaultValue={i.description}></textarea>     {/*w-264px */}   
                        {state!=null && state.errorField==="instructions" && state.index === i.order && <div id={"instruction-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                        <div className="flex flex-row md:hidden">
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm max-w-[130px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 mb-3 text-red-700 text-2xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                        {i.imageErrorText!="" && <p className="md:hidden mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                        <div className="flex flex-row-reverse mt-2 md:hidden"><button className="btn" type="button" disabled>Remove Instruction</button></div>
                    </td>
                    <td className="hidden border border-gray-300 md:table-cell w-[260px]">
                        
                        <div className="flex flex-col">
                        <div>
                            <input defaultChecked={initialInstructionImageSettings[i.order-1]=="existing" ? true : false} type="radio" name={"instruction-image-option-"+i.order} id={"instruction-image-existing-"+i.order} value="existing"></input>
                            <label htmlFor={"instruction-image-existing-"+i.order}>Choose from existing: </label>
                            <select name="instruction-image-filename" defaultValue={initialInstructionImages[i.order-1].url!=="" ? initialInstructionImages[i.order-1].filename : "--Select--"} className="select" onChange={e=>{updateInstructionUrl(i.id, e.target.selectedIndex)}}>
                                {imageSelectItems}
                            </select>
                            <input ref={(urlNode)=>{const urlMap=getUrlMap(); if(urlNode){urlMap.set(i.id,urlNode);}else urlMap.delete(i.id)}} className="hidden" name="instruction-image-url" defaultValue={initialInstructionImages[i.order-1].url==="" ? images[0].url : initialInstructionImages[i.order-1].url}></input>
                        </div>
                        <div className="flex flex-row">
                            <input defaultChecked={initialInstructionImageSettings[i.order-1]=="new" ? true : false} type="radio" name={"instruction-image-option-"+i.order} id="instruction-image-new" value="new"></input>
                            <label htmlFor="description-image-new">Choose from device: </label>
                            <input ref={(node)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>updateInstructionImage(i.id)} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>              
                            <label htmlFor={"instruction-image-"+i.id} className="relative btn"><span className="text-sm">Choose File</span></label>
                            <p className="ml-2 mt-4 mr-2 text-sm max-w-[130px] whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                            {i.fileChosen && <button type="button" className="ml-2 text-red-700 text-3xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                        <div>
                            <input defaultChecked={initialInstructionImageSettings[i.order-1]=="none" ? true : false} type="radio" name={"instruction-image-option-"+i.order} id="instruction-image-none" value="none"></input>
                            <label htmlFor="instruction-image-none">None</label>
                        </div>
                    
                        {/* <input ref={(node)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>{updateInstructionImage(i.id);}} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm min-w-[100px] max-w-[100px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 mb-2 text-red-700 text-2xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>} */}
                        </div>
                        {i.imageErrorText!="" && <p className="mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                    </td>
                    <td className="hidden border border-gray-300 md:table-cell w-[80px]"><button className="btn" type="button" disabled>Remove</button></td>
                </tr>
            </tbody>)
        }else{
            return(<tbody key={i.id}>
                <tr className="border border-gray-300">
                    <td className="border border-gray-300"><p className="text-center">{i.order}</p></td>
                    <td className="border border-gray-300 md:[w-100%]">
                        <p className="md:hidden">Instruction:</p>
                        <textarea aria-describedby={"instruction-error"+i.id} className="w-[100%] p-1 rounded h-20" name="instruction-description" defaultValue={i.description}></textarea>
                        {state!=null && state.errorField==="instructions" && state.index === i.order && <div id={"instruction-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                        <div className="flex flex-row md:hidden">
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm max-w-[130px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 mb-3 text-red-700 text-2xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                        {i.imageErrorText!="" && <p className="md:hidden mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                        <div className="flex flex-row-reverse mt-2 md:hidden"><button className="btn" type="button" onClick={()=>{removeInstruction(i.id)}}>Remove Instruction</button></div>
                    </td>
                    <td className="hidden border border-gray-300 md:table-cell w-[260px]">
                    
                    <div className="flex flex-col">
                        <div>
                            <input defaultChecked={initialInstructionImageSettings[i.order-1]=="existing" ? true : false} type="radio" name={"instruction-image-option-"+i.order} id={"instruction-image-existing-"+i.order} value="existing"></input>
                            <label htmlFor={"instruction-image-existing-"+i.order}>Choose from existing: </label>
                            <select name="instruction-image-filename" defaultValue={initialInstructionImages[i.order-1].url!=="" ? initialInstructionImages[i.order-1].filename : initialInstructionImages[0].filename} className="select" onChange={e=>{updateInstructionUrl(i.id, e.target.selectedIndex)}}>
                                {imageSelectItems}
                            </select>
                            <input ref={(urlNode)=>{const urlMap=getUrlMap(); if(urlNode){urlMap.set(i.id,urlNode);}else urlMap.delete(i.id)}} className="hidden" name="instruction-image-url" defaultValue={initialInstructionImages[i.order-1].url==="" ? images[0].url : initialInstructionImages[i.order-1].url}></input>
                        </div>
                        <div className="flex flex-row">
                            <input defaultChecked={initialInstructionImageSettings[i.order-1]=="new" ? true : false} type="radio" name={"instruction-image-option-"+i.order} id="instruction-image-new" value="new"></input>
                            <label htmlFor="description-image-new">Choose from device: </label>
                            <input ref={(node)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>updateInstructionImage(i.id)} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                            <label htmlFor={"instruction-image-"+i.id} className="relative btn"><span className="text-sm">Choose File</span></label>
                            <p className="ml-2 mt-4 mr-2 text-sm max-w-[130px] whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                            {i.fileChosen && <button type="button" className="ml-2 text-red-700 text-3xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                        <div>
                            <input defaultChecked={initialInstructionImageSettings[i.order-1]=="none" ? true : false} type="radio" name={"instruction-image-option-"+i.order} id="instruction-image-none" value="none"></input>
                            <label htmlFor="instruction-image-none">None</label>
                        </div>
                    </div>
                        {/* <input ref={(node)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>updateInstructionImage(i.id)} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm min-w-[100px] max-w-[100px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 text-red-700 text-3xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>} */}
                   
                    {i.imageErrorText!="" && <p className="mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                    </td>
                    <td className=" hidden border border-gray-300 md:table-cell w-[80px]"><button className="btn" type="button" onClick={()=>{removeInstruction(i.id)}}>remove</button></td>
                </tr>
            </tbody>)
        }
        }
        )

        const noteItems = notes.map(n=>
            {if(n.id===0){
                return(
                    null
                )
            }else{
                return (
                    <tbody className="border border-gray-300" key={n.id}><tr className="border border-gray-300">
                        <td className="border border-gray-300"><p className="text-center">{n.order}</p></td>
                        <td className="border border-gray-300">
                            <textarea aria-describedby={"notes-error"+n.id} className="w-[100%] p-1 rounded border border-gray-200" name="notes" defaultValue={n.description}></textarea>
                            {state!=null && state.errorField==="notes" && state.index === n.order && <div id={"notes-error"+n.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                            <div className="flex flex-row-reverse"><button type="button" onClick={()=>removeNote(n.id)} className=" btn mr-1 text-sm">Remove Note</button></div>
                        </td>
                        <td className="hidden border border-gray-300"><button type="button" onClick={()=>removeNote(n.id)} className=" btn mr-1 text-sm">Remove</button></td>
                    </tr></tbody>
                )
            }
            }
            )

            const ingredientItems = ingredients.map(i=>
                {if(i.id===0){
        
                    return  ( <tbody className=" border border-gray-300" key={i.id}><tr className="border border-gray-300">
                                <td className="border border-gray-300"><p className="md:w-5 text-center">{i.order}</p></td>
                                <td className=" border border-gray-300 md:w-[120%]">
                                    {/* <p className="md:hidden">Ingredient:</p> */}
                                    <textarea aria-describedby={"ingredient-error"+i.id} className=" w-[100%] p-1 rounded resize-none " name="ingredient-description" placeholder="Your first ingredient" defaultValue={i.description}></textarea>{/*w-264px */}
                                    {state!=null && state.errorField==="ingredients" && state.index === i.order && <div id={"ingredient-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                                </td>
                                <td className=" border border-gray-300 md:table-cell"><button className=" btn" type="button" disabled>Remove</button></td>
                            </tr></tbody>)
                }else{
                    return (<tbody className=" border border-gray-300" key={i.id}><tr className="border border-gray-300">
                                <td className="border border-gray-300"><p className="md:w-5 text-center">{i.order}</p></td>
                                <td className=" border border-gray-300 md:w-[120%]">
                                    {/* <p className="md:hidden">Ingredient:</p> */}
                                    <textarea aria-describedby={"ingredient-error"+i.id} className=" w-[100%] p-1 rounded resize-none" name="ingredient-description" defaultValue={i.description}></textarea>
                                    {state!=null && state.errorField==="ingredients" && state.index === i.order && <div id={"ingredient-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                                </td>
                                <td className=" border border-gray-300 md:table-cell"><button className="btn" type="button" onClick={()=>{removeIngredient(i.id)}}>remove</button></td>
                    </tr></tbody>)
                }}
                )

        function getMap(){
            if(!instructionImagesRef.current){
                 instructionImagesRef.current = new Map()
            }
            return instructionImagesRef.current
        }

        function getUrlMap(){
            if(!instructionUrlsRef.current){
                instructionUrlsRef.current = new Map()
            }
            return instructionUrlsRef.current
        }

    return(
        <>
            <form className="mb-40 mx-auto w-[97%] border rounded-lg border-gray-400 p-2" action={dispatch}>
                <input className="hidden" name="recipe-uuid" defaultValue={oriRecipe.uuid}></input>
                <div>
                    <ol>
                        {imageItems}
                    </ol>
                </div>
                <div className="flex flex-row">
                <label className="label mr-[7px]" htmlFor="title"><span className=" text-base font-bold">Title<span className="text-base text-red-600">*</span></span></label>
                    <input type="text" name="title" aria-describedby="title-error" className="h-10 input w-96" onChange={(e)=>setTitle(e.target.value)} value={title}/>
                    <button type="button" className="btn" onClick={resetTitle}>Reset</button>
                </div>
                {state!=null && state.errorField==="title" && <div id="title-error" aria-live="polite" aria-atomic="true"><p className="mt-2 ml-14 text-sm text-red-500">{state.message}</p></div>}
                <div className="form-control">
                    <label className="label" htmlFor="description"><span className="text-base font-bold">Description<span className="text-base text-red-600">*</span></span></label><button type="button" className="btn" onClick={resetDescription}>Reset</button>
                    <textarea className="p-1 w-[100%] textarea-bordered h-40" name="description" aria-describedby="description-error" onChange={e=>setDescription(e.target.value)} value={description}/> {/*w-282px*/}
                </div> 
                {state!=null && state.errorField==="description" && <div id="description-error" aria-live="polite" aria-atomic="true"><p className="mt-2 text-sm text-red-500">{state.message}</p></div>}
                <div className="">
                    <label className="label" ><span className="text-base font-bold">Description Image:</span></label>
                    <div className="flex flex-col">
                        <div>
                            <input defaultChecked={initialSetting=="existing" ? true : false} type="radio" name="description-image-option" id="description-image-existing" value="existing"></input>
                            <label htmlFor="description-image-existing">Choose from existing: </label>
                            <select name="description-image-filename" defaultValue={oriDescriptionMedia!==null ? oriDescriptionMedia.filename : "--Select--"} className="select" onChange={e=>{setExistingDescriptionImage(oriImageList[e.target.selectedIndex])}}>
                                {imageSelectItems}
                            </select>
                            <input className="hidden" name="description-image-url" defaultValue={existingDescriptionImage.url}></input>
                        </div>
                        <div className="flex flex-row">
                            <input defaultChecked={initialSetting=="new" ? true : false} type="radio" name="description-image-option" id="description-image-new" value="new"></input>
                            <label htmlFor="description-image-new">Choose from device: </label>
                            <input ref={descriptionImageRef} onChange={e=>{setDescriptionImage({name: descriptionImageRef.current.files[0].name, fileChosen: true, buttonText:"Repick Image"}); ValidateDescriptionImage(descriptionImageRef.current.files[0])}} hidden type="file" name="description-image" id="description-image"/>
                            <label htmlFor="description-image" className="relative btn"><span className="text-sm">Choose File</span></label>
                            <p className="ml-2 mt-4 mr-2 text-sm max-w-[130px] whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{descriptionImage.name}</p>
                            {descriptionImage.fileChosen && <button type="button" className=" btn-ghost text-red-700 text-2xl" onClick={()=>{descriptionImageRef.current.files=null; setDescriptionImage({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})}}>&times;</button>}
                        </div>
                        <div>
                            <input defaultChecked={initialSetting=="none" ? true : false} type="radio" name="description-image-option" id="description-image-none" value="none"></input>
                            <label htmlFor="description-image-none">None</label>
                        </div>
                    </div>
                    {descriptionImageError!=="" && <p className="mt-2 ml-1 text-sm text-red-500">{descriptionImageError}</p>}
                </div> 

                <section className="flex flex-col sm:flex-row">

                <section className=" sm:ml-auto sm:mr-0">
                <div className="flex flex-row">
                    <label className="label mr-3" htmlFor="prep-time"><span className="text-base font-bold">Preperation <br className="md:hidden"></br> Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <input onChange={e=>setPrepTime(e.target.value)} value={prepTime} aria-describedby="prep_time-error" type="number" name="prep-time" className="mt-2 w-36 input input-bordered"/>{/*w-36 */}
                    <button type="button" className="btn" onClick={resetPrepTime}>Reset</button>
                </div> 
                {state!=null && state.errorField==="prep_time" && <div id="prep_time-error" aria-live="polite" aria-atomic="true"><p className="mt-1 ml-[230px] text-xs text-red-500">{state.message}</p></div>}
                <div className=" flex flex-row ">
                    <label className="label mr-3 md:mr-[63px]" htmlFor="cook-time"><span className="text-base font-bold">Cook <br className="md:hidden"></br> Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <input onChange={e=>setCookTime(e.target.value)} value={cookTime} aria-describedby="cook_time-error" type="number" name="cook-time" className="mt-2 w-36 input input-bordered"/>
                    <button type="button" className="btn" onClick={resetCookTime}>Reset</button>
                </div>
                {state!=null && state.errorField==="cook_time" && <div id="cook_time-error" aria-live="polite" aria-atomic="true"><p className="mt-1 ml-[230px] text-xs text-red-500">{state.message}</p></div>}
                <div className="mt-2 flex flex-row ">
                    <label className="label mr-14 md:mr-[150px]" htmlFor="servings"><span className=" text-base font-bold">Servings<span className="text-base text-red-600">*</span></span></label>
                    <input onChange={e=>setServings(e.target.value)} value={servings} aria-describedby="servings-error" type="number" name="servings" className=" w-36 input input-bordered"/>
                    <button type="button" className="btn" onClick={resetServings}>Reset</button>
                </div>
                {state!=null && state.errorField==="servings" && <div id="servings-error" aria-live="polite" aria-atomic="true"><p className="mt-1 ml-[230px] text-xs text-red-500">{state.message}</p></div>}
                </section>
                </section>

                <div className="pt-2 border rounded-md border-gray-300 mt-2 flex flex-col">
                    <div className=" flex flex-row">
                    <label className="label" htmlFor="ingredients"><span className="text-base font-bold">Ingredients<span className="text-base text-red-600">*</span></span></label>
                    <button type="button" className="ml-5 w-36 btn bg-gray-100" onClick={addIngredient}>Add Ingredient</button>
                    <button type="button" className="btn" onClick={resetIngredients}>Reset</button>
                    </div>

                    <table className="table-auto w-[100%] mt-3 border border-gray-300">{/*w-280px */}
                        <thead className="">
                        <tr className="border border-gray-300">
                            <th className="hidden border border-gray-300 md:table-cell"></th>
                            <th className="hidden border border-gray-300 md:table-cell"><span className="text-base font-bold">Ingredient</span></th>
                            <th className="hidden border border-gray-300 md:table-cell"></th>
                        </tr>
                        </thead>
                        {ingredientItems}
                    </table>
                </div>

                <div className="pt-2 border rounded-md border-gray-300 mt-2 form-control">
                    <div className="mt-3 flex flex-row">
                    <label className="label" htmlFor="instructions"><span className="text-base font-bold">Instructions<span className="text-base text-red-600">*</span></span></label>
                    <button type="button" className="ml-5 w-36 btn bg-gray-100" onClick={addInstruction}>Add Instruction</button>
                    <button type="button" className="btn" onClick={resetInstructions}>Reset</button>
                    </div>

                    <table className="table-auto w-[100%] mt-3 border border-gray-300">
                        <thead>
                        <tr className="border border-gray-300">
                            <th className="hidden border border-gray-300 md:table-cell"></th><th className="hidden border border-gray-300 md:table-cell"><span className="text-lg font-bold">Instruction</span></th><th className="hidden border border-gray-300 md:table-cell"><span className="text-lg font-bold">Image</span></th><th className="hidden border border-gray-300 md:table-cell"></th>
                        </tr>
                        </thead>
                        {instructionItems}
                    </table>
                </div>
                <div className=" p-1 border rounded-md border-gray-200 mt-3 flex flex-col">
                    <div className="flex flex-row">
                    <label className="label mr-[71px]" htmlFor="notes"><span className="text-base font-bold">Notes</span></label>
                    <button type="button" className=" w-36 btn" onClick={addNote}>Add Note</button>
                    <button type="button" className="btn" onClick={resetNotes}>Reset</button>
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
                    <input type="radio" name="accessibility" id="private" value="private"/><label>Private (only you can access)</label>
                    <input checked type="radio" name="accessibility" id="public" value="public"/><label>Public (anyone with link can access, but only you can modify)</label>
                </div>
                <div className="mt-3 mb-7 flex flex-row-reverse">
                <button className="btn ml-3 bg-red-600">Submit</button>
                <button type="button" className="btn bg-orange-400">Preview</button>   
                </div>
            </form>
        </>

    )
}