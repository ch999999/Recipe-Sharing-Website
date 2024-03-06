'use client'
import { useFormState } from "react-dom"
import { useState } from "react"
import { useRef } from "react"
import { useEffect } from "react"
import { fetchDiets } from "@/app/lib/actions"
import { createNewRecipe } from "@/app/lib/actions"
import ValidateImage from "@/app/lib/validators/ImageValidator"

const dietsSet = [
    {id: 0, name: "Vegan"},
    {id: 1, name: "Carnivore"},
    {id: 2, name: "Keto"}
]

const difficultiesSet = [
    {id: 0, name: "Easy"},
    {id: 1, name: "Medium"},
    {id: 2, name: "Hard"}
]

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

const tagsSet = [
    {id: 0, name: "Chicken"},
    {id: 1, name: "Rice"},
    {id: 2, name: "Sugar"}
]

const cuisinesSet = [
    {id:0, name: "European"},
    {id:1, name:"Asian"},
    {id:2, name:"Chinese"},
    {id:3, name:"African"},
    {id:4, name:"Western"}
]

function test(evt){
    evt.preventDefault();
    // let diets = evt.target['diets']
    // if(!diets.length){
    //     console.log(diets.value)
    // }
    // for(let i=0; i<diets.length; i++){
    //     console.log(diets[i].value)
    // }

    // let ingredientDescriptions = evt.target['ingredient-description']
    // let ingredientQuantities = evt.target['ingredient-quantity']
    // let ingredientUnits = evt.target['ingredient-units']

    // if(!ingredientDescriptions.length){
    //     console.log("Description: "+ ingredientDescriptions.value+", Quantity: "+ingredientQuantities.value+", Units: "+ingredientUnits.value)
    // }else{
    // for(let i=0; i<ingredientDescriptions.length; i++){
    //     console.log("Description: "+ ingredientDescriptions[i].value+", Quantity: "+ingredientQuantities[i].value+", Units: "+ingredientUnits[i].value)
    // }
    // }


    // let instructionDescriptions = evt.target['instruction-description']
    // if(!instructionDescriptions.length){
    //     console.log("Description: "+instructionDescriptions.value)
    // }else{
    //     for(let i=0; i<instructionDescriptions.length; i++){
    //         console.log("Description "+ instructionDescriptions[i].value)
    //     }
    // }

    let notes = evt.target['notes']
    if(!notes.length){
        console.log(notes.value)
    }else{
        for(let i=0; i<notes.length; i++){
            console.log(notes[i].value)
        }
    }
}

let ingredientCount=0
let instructionCount=0
let notesCount=0

export default function Form({diets, cuisines, difficulties, tags}){
    const initialState = {errorField:null, message:null, index:null}
    const [state, dispatch] = useFormState(createNewRecipe, initialState)

    const descriptionImageRef = useRef(null)
    const instructionImagesRef = useRef(null)

    const [descriptionImageError, setDescriptionImageError] = useState("")
    const [dietToAdd, setDietToAdd] = useState(diets[0].diet_Name) 
    const [selectedDiets, setSelectedDiets] = useState([]) 
    //const [ingredientToUpate, setIngredientToUpdate] = useState(0)
    const [ingredients, setIngredients] = useState([{id: 0, description: "Your first ingredient", quantity:0, unit:units[0].name, order:1}])
    const [instructions, setInstructions] = useState([{id: 0, description: "Your first instruction", order:1, imageFileName:"No file chosen", fileChosen: false, imageButtonText: "Choose Image", imageErrorText: ""}])
    const [selectedTags, setSelectedTags] = useState([]) 
    const [tagToAdd, setTagToAdd] = useState(tags[0].tag_Name)
    const [notes, setNotes] = useState([{id:0, description:"", order: 0}]) 
    const [descriptionImage, setDescriptionImage] = useState({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})
    const [selectedCuisine, setSelectedCuisine] = useState(1)
    const [selectedDifficulty, setSelectedDifficulty] = useState(1)

    const cusineItems = cuisines.map(c=>
        <option key={c.id} value={c.cuisine_Name}>{c.cuisine_Name}</option>
        )

    const tagItems = tags.map(t=>
        <option key={t.id}>{t.tag_Name}</option>
        )

    const unitItems = units.map(u=>
        <option key={u.id}>{u.name}</option>
        )

    const difficultyItems = difficulties.map(d=>
        <option key={d.id} value={d.difficulty_Name}>{d.difficulty_Name}</option>
        )

    const instructionItems = instructions.map(i=>
        {if(i.id===0){
            return(<tbody className=" border border-gray-300" key={i.id}>
                <tr className=" border border-gray-300">
                    <td className="border border-gray-300"><p className=" text-center">{i.order}</p></td>
                    <td className="border border-gray-300 md:[w-120%]">
                        <p className="md:hidden">Instruction:</p>
                        <textarea aria-describedby={"instruction-error"+i.id} className="w-[100%] p-1 rounded h-20" name="instruction-description" placeholder={i.description}></textarea>     {/*w-264px */}   
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
                        <div className="w-[100px] flex flex-row">
                        <input ref={(node)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>{updateInstructionImage(i.id);}} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm min-w-[100px] max-w-[100px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 mb-2 text-red-700 text-2xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
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
                    <td className="border border-gray-300 md:[w-120%]">
                        <p className="md:hidden">Instruction:</p>
                        <textarea aria-describedby={"instruction-error"+i.id} className="w-[100%] p-1 rounded h-20" name="instruction-description" placeholder={i.description}></textarea>
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
                    <div className="w-[100px] flex flex-row">
                        <input ref={(node)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>updateInstructionImage(i.id)} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 text-sm min-w-[100px] max-w-[100px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 text-red-700 text-3xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                    </div>
                    {i.imageErrorText!="" && <p className="mt-2 ml-2 text-sm text-red-500">{i.imageErrorText}</p>}
                    </td>
                    <td className=" hidden border border-gray-300 md:table-cell w-[80px]"><button className="btn" type="button" onClick={()=>{removeInstruction(i.id)}}>remove</button></td>
                </tr>
            </tbody>)
        }
        }
        )
    
    // const noteItems = notes.map(n=>
    //     <li className="mt-3" key={n.id}><textarea className="ml-2 mr-2 text-sm textarea-bordered p-1 w-[260px] h-20" name="notes"></textarea><div className="flex flex-row-reverse"><button type="button" onClick={()=>removeNote(n.id)} className=" btn-ghost mr-1 text-sm text-red-700">Remove</button></div></li>
    //     )

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
                        <textarea aria-describedby={"notes-error"+n.id} className="w-[100%] p-1 rounded border border-gray-200" name="notes"></textarea>
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
                            <textarea aria-describedby={"ingredient-error"+i.id} className=" w-[100%] p-1 rounded resize-none " name="ingredient-description" placeholder={i.description}></textarea>{/*w-264px */}
                            {state!=null && state.errorField==="ingredients" && state.index === i.order && <div id={"ingredient-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                            {/* <div className="md:hidden"><span className="mr-[50px]">Quantity:</span><input className="input w-36 h-10" type="number" onChange={e=>updateQuantity(i.id, e)} value={i.quantity}></input></div>
                            <input hidden onChange={()=>{}} name="ingredient-quantity" value={i.quantity}></input>
                            <div className="mt-2 md:hidden"><span className="mr-[75px]"> Units:</span><select onChange={e=>updateUnits(i.id, e)} className="select w-36" value={i.unit}>{unitItems}</select></div>
                            <input hidden onChange={()=>{}} name="ingredient-unit" value={i.unit}></input>
                            <div className="flex flex-row-reverse mt-2 mb-1 mr-2 md:hidden"><button className=" btn" type="button" disabled>Remove</button></div> */}
                        </td>
                        {/* <td className="hidden border border-gray-300 md:table-cell"><input className="input w-[172px] md:w-[120px]" type="number" onChange={e=>updateQuantity(i.id, e)} value={i.quantity}></input></td>
                        <td className=" hidden border-gray-300 md:table-cell">
                            <select onChange={e=>updateUnits(i.id, e)} className="select" value={i.unit}>
                                {unitItems}
                            </select>               
                        </td> */}    {/*hidden(below)*/}
                        <td className=" border border-gray-300 md:table-cell"><button className=" btn" type="button" disabled>Remove</button></td>
                    </tr></tbody>)
        }else{
            return (<tbody className=" border border-gray-300" key={i.id}><tr className="border border-gray-300">
                        <td className="border border-gray-300"><p className="md:w-5 text-center">{i.order}</p></td>
                        <td className=" border border-gray-300 md:w-[120%]">
                            {/* <p className="md:hidden">Ingredient:</p> */}
                            <textarea aria-describedby={"ingredient-error"+i.id} className=" w-[100%] p-1 rounded resize-none" name="ingredient-description" placeholder={i.description}></textarea>
                            {state!=null && state.errorField==="ingredients" && state.index === i.order && <div id={"ingredient-error"+i.id} aria-live="polite" aria-atomic="true"><p className="mt-1 text-sm text-red-500">{state.message}</p></div>}
                            {/* <div className="md:hidden"><span className="mr-[50px]">Quantity:</span><input className="input w-36 h-10" type="number" onChange={e=>updateQuantity(i.id, e)} value={i.quantity}></input></div>
                            <input hidden onChange={()=>{}} name="ingredient-quantity" value={i.quantity} ></input>
                            <div className="mt-2 md:hidden"><span className="mr-[75px]"> Units:</span><select onChange={e=>updateUnits(i.id, e)} className="select w-36" value={i.unit}>{unitItems}</select></div>
                            <input hidden onChange={()=>{}} name="ingredient-unit" value={i.unit}></input>
                            <div className="flex flex-row-reverse mt-2 mb-1 mr-2 md:hidden"><button className="btn" type="button" onClick={()=>{removeIngredient(i.id)}}>remove</button></div> */}
                        </td>
                        {/* <td className=" hidden border border-gray-300 md:table-cell"><input className="input w-[172px] md:w-[120px]" type="number" onChange={e=>updateQuantity(i.id, e)} value={i.quantity}></input></td>
                        <td className="hidden border border-gray-300 md:table-cell">
                        <select onChange={e=>updateUnits(i.id, e)} className="select" value={i.unit}>
                                {unitItems}
                        </select>
                        </td> */}  {/*hidden(below)*/}
                        <td className=" border border-gray-300 md:table-cell"><button className="btn" type="button" onClick={()=>{removeIngredient(i.id)}}>remove</button></td>
            </tr></tbody>)
        }}
        )

    const dietItems = diets.map(d =>
        <option key={d.id}>{d.diet_Name}</option>
      );

    const selectedDietItems = selectedDiets.map(diet=>
        
        <li className="mt-3" key={diet.id}><input disabled className="" value={diet.name}></input><input className="hidden" name="diets" value={diet.id}></input><button type="button" onClick={()=>removeDiet(diet.id)} className="btn -ml-3">remove</button></li>
            
        ) 
    //  const inputs = selectedDiets.map(diet=>
    //     <input key={diet.id} name="diets">{diet.name}</input>
    //     )

    const selectedTagItems = selectedTags.map(t=>
        <li className="mt-2" key={t.id}><input disabled value={t.name}></input><input className="hidden" name="tags" value={t.id}></input> <button type="button" onClick={()=>removeTag(t.id)} className="btn -ml-5">remove</button></li>
        )

    

    function ValidateDescriptionImage(file){
        const error = ValidateImage(file)
        if(error){
            descriptionImageRef.current.files=null; 
            setDescriptionImage({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})
            setDescriptionImageError(error.message)
        }else{
            setDescriptionImageError("")
        }

    }    

    function updateQuantity(id, e){
        const nextIngredients = ingredients.map(i=>{
            if(i.id===id){
                return {
                    ...i,
                    quantity: e.target.value
                }
            }else{
                return i
            }
        })
        setIngredients(nextIngredients)
    }

    function updateUnits(id, e){
        const nextIngredients = ingredients.map(i=>{
            if(i.id===id){
                return{ ...i,
                unit: e.target.value}
            }else{
                return i
            }
        })
        setIngredients(nextIngredients)
    }

    function countNodes(){
        const map = getMap()
        instructions.forEach(function(i){
            const node=map.get(i.id)
            console.log(node)
        })
    }

    function getMap(){
        if(!instructionImagesRef.current){
            instructionImagesRef.current = new Map()
        }
        return instructionImagesRef.current
    }

    function ValidateInstructionImage(id){
        const map = getMap();
        const node = map.get(id)
        const error = ValidateImage(node.files[0])
        if(error){
            
        }

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

    function addNote(){
        notesCount++;
        setNotes([
            ...notes,
            {id: notesCount, description:"",order:notes.length}
        ])
    }

    function removeNote(id){
        const copy = [...notes]
        const nextNotes = copy.filter(i=>
            i.id!=id
            )
        
            //reorder based on array index
            for(let j=0; j<notes.length-1; j++){
                nextNotes[j].order = j
            }
        setNotes(nextNotes)
    }

    function removeTag(id){
        setSelectedTags(
            selectedTags.filter(t=>
                t.id!==id
                )
        )
    }

    function addIngredient(){
        ingredientCount++;
        setIngredients([
            ...ingredients,
            {id: ingredientCount, description: "", quantity:0, unit:units[0].name, order: ingredients.length+1}
        ])
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

    function addTag(){
        const tagExists = selectedTags.find(({name})=>name===tagToAdd);
        if(tagExists){
            return;
        }
        const tag = tags.find(({tag_Name})=>tag_Name===tagToAdd);
        setSelectedTags([
            ...selectedTags,
            {id: tag.id, name: tagToAdd}
        ]);
    }

    function addDiet(){
        //setSelectedDiets([...selectedDiets,{id:9, name: selectedDiet}]);
        const dietExists = selectedDiets.find(({ name }) => name === dietToAdd);
        if(dietExists){
            return;
        }
        const diet = diets.find(({diet_Name})=>diet_Name===dietToAdd);
        setSelectedDiets([
            ...selectedDiets,
            { id: diet.id, name: dietToAdd }
          ]);
    }

    function removeDiet(id){
        setSelectedDiets(
            selectedDiets.filter(diet =>
              diet.id !== id
            ))
    }

    function addInstruction(){
        instructionCount++;
        setInstructions([
            ...instructions,
            {id: instructionCount, description:"", order: instructions.length+1, imageFileName:"No file chosen", imageButtonText:"Choose Image",fileChosen: false}
        ])
        
    }

    function removeInstruction(id){
        // const map = getMap();
        // const node = map.get(id);
        // node.files = null;
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

    function setNewCuisine(cuisine){
        const newCuisine = cuisines.find(({cuisine_Name})=>cuisine_Name===cuisine)
        setSelectedCuisine(newCuisine.id)
    }

    function setNewDifficulty(diff){
        const newDiff = difficulties.find(({difficulty_Name})=>difficulty_Name===diff)
        setSelectedDifficulty(newDiff.id)
    }

    return(
        <>
            <form className="mb-40 mx-auto w-[97%] border rounded-lg border-gray-400 p-2" action={dispatch}>{/*w-300px*/}
                <div className="flex flex-row">
                    <label className="label mr-[7px]" htmlFor="title"><span className=" text-base font-bold">Title<span className="text-base text-red-600">*</span></span></label>
                    <input type="text" name="title" aria-describedby="title-error" className="h-10 input w-96"/>
                </div> 
                {state!=null && state.errorField==="title" && <div id="title-error" aria-live="polite" aria-atomic="true"><p className="mt-2 ml-14 text-sm text-red-500">{state.message}</p></div>}
                <div className="form-control">
                    <label className="label" htmlFor="description"><span className="text-base font-bold">Description<span className="text-base text-red-600">*</span></span></label>
                    <textarea className="p-1 w-[100%] textarea-bordered h-40" name="description" aria-describedby="description-error"/> {/*w-282px*/}
                </div> 
                {state!=null && state.errorField==="description" && <div id="description-error" aria-live="polite" aria-atomic="true"><p className="mt-2 text-sm text-red-500">{state.message}</p></div>}
                <div className="">
                    <label className="label" ><span className="text-base font-bold">Description Image:</span></label>
                    <div className="flex flex-row">
                    <input ref={descriptionImageRef} onChange={e=>{setDescriptionImage({name: descriptionImageRef.current.files[0].name, fileChosen: true, buttonText:"Repick Image"}); ValidateDescriptionImage(descriptionImageRef.current.files[0])}} hidden type="file" name="description-image" id="description-image"/>
                    <label htmlFor="description-image" className="relative btn"><span className="text-sm">{descriptionImage.buttonText}</span></label>
                    <p className="ml-2 mt-4 mr-2 text-sm max-w-[130px] whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{descriptionImage.name}</p>
                    {descriptionImage.fileChosen && <button type="button" className=" btn-ghost text-red-700 text-2xl" onClick={()=>{descriptionImageRef.current.files=null; setDescriptionImage({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})}}>&times;</button>}
                    </div>
                    {descriptionImageError!=="" && <p className="mt-2 ml-1 text-sm text-red-500">{descriptionImageError}</p>}
                </div> 

                <section className="flex flex-col sm:flex-row">
                <section>
                <div className="mt-3 flex flex-row">
                    <label className="label mr-[47px]" htmlFor="difficulty"><span className="text-base font-bold">Difficulty<span className="text-base text-red-600">*</span></span></label>
                    <select className="select w-36" onChange={e=>setNewDifficulty(e.target.value)}>
                        {difficultyItems}
                    </select>
                    <input className="hidden" name="difficulty" defaultValue={selectedDifficulty}></input>
                </div>
                <div className="mt-3 flex flex-row">
                    <label className="label mr-[70px]" htmlFor="cuisine"><span className="text-base font-bold">Cuisine</span></label>
                    <select className="select w-36" onChange={e=>{setNewCuisine(e.target.value)}}>
                        {cusineItems}
                    </select>
                    <input className="hidden" name="cuisine" defaultValue={selectedCuisine}></input>
                </div>
                <div className="p-1 border rounded-md border-gray-300 w-[285px] mt-3 flex flex-col">
                    <div className="flex flex-row">
                    <label className="label mr-2" htmlFor="dietsSelect"><span className="text-base font-bold">Diets</span></label>
                    <select className="select" name="dietsSelect" onChange={e=>{setDietToAdd(e.target.value)}}>
                        {dietItems}
                    </select>
                    
                    <button type="button" className="ml-3 btn" onClick={addDiet}>Add diet</button>
                    </div>
                    {selectedDiets.length===0 && <p className="mt-2 ml-2 italic">No diets selected</p>}
                    <ol type="1" className="list-inside list-decimal">
                        {selectedDietItems}
                    </ol>
                </div>
                </section>

                <section className=" sm:ml-auto sm:mr-0">
                <div className="flex flex-row">
                    <label className="label mr-3" htmlFor="prep-time"><span className="text-base font-bold">Preperation <br className="md:hidden"></br> Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <input aria-describedby="prep_time-error" type="number" name="prep-time" className="mt-2 w-36 input input-bordered"/>{/*w-36 */}
                </div> 
                {state!=null && state.errorField==="prep_time" && <div id="prep_time-error" aria-live="polite" aria-atomic="true"><p className="mt-1 ml-[230px] text-xs text-red-500">{state.message}</p></div>}
                <div className=" flex flex-row ">
                    <label className="label mr-3 md:mr-[63px]" htmlFor="cook-time"><span className="text-base font-bold">Cook <br className="md:hidden"></br> Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <input aria-describedby="cook_time-error" type="number" name="cook-time" className="mt-2 w-36 input input-bordered"/>
                </div>
                {state!=null && state.errorField==="cook_time" && <div id="cook_time-error" aria-live="polite" aria-atomic="true"><p className="mt-1 ml-[230px] text-xs text-red-500">{state.message}</p></div>}
                <div className="mt-2 flex flex-row ">
                    <label className="label mr-14 md:mr-[150px]" htmlFor="servings"><span className=" text-base font-bold">Servings<span className="text-base text-red-600">*</span></span></label>
                    <input aria-describedby="servings-error" type="number" name="servings" className=" w-36 input input-bordered"/>
                </div>
                {state!=null && state.errorField==="servings" && <div id="servings-error" aria-live="polite" aria-atomic="true"><p className="mt-1 ml-[230px] text-xs text-red-500">{state.message}</p></div>}
                </section>
                </section>

                <div className="pt-2 border rounded-md border-gray-300 mt-2 flex flex-col">
                    <div className=" flex flex-row">
                    <label className="label" htmlFor="ingredients"><span className="text-base font-bold">Ingredients<span className="text-base text-red-600">*</span></span></label>
                    <button type="button" className="ml-5 w-36 btn bg-gray-100" onClick={addIngredient}>Add Ingredient</button>
                    </div>

                    <table className="table-auto w-[100%] mt-3 border border-gray-300">{/*w-280px */}
                        <thead className="">
                        <tr className="border border-gray-300">
                            <th className="hidden border border-gray-300 md:table-cell"></th>
                            <th className="hidden border border-gray-300 md:table-cell"><span className="text-base font-bold">Ingredient</span></th>
                            {/* <th className="hidden border border-gray-300 md:table-cell">Quantity</th>
                            <th className="hidden border border-gray-300 md:table-cell">Units</th> */}
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
                    </div>
                    <table className="table-auto w-[100%] mt-3 border border-gray-300">
                        <thead>
                            <tr className="border border-gray-300">
                            <th className="hidden border border-gray-300"></th><th className="hidden border border-gray-300"><span className="text-lg font-bold">Note</span></th><th className="hidden border border-gray-300"></th>
                            </tr>
                        </thead>
                        {noteItems}
                    </table>
                    {/* {notes.length===0&&<p className="mt-2 ml-2 italic">No notes added</p>}
                    <ol type="1" className="list-inside list-decimal">
                        {noteItems}
                    </ol> */}
                </div>
                <div className="p-1 border rounded-md border-gray-200 mt-3 flex flex-col">
                    <div className="flex flex-row">
                    <label className="label mr-2" htmlFor="tagsSelect"><span className="text-basse font-bold">Tags</span></label>
                    <select className="select w-36 bg-slate-300" name="tagsSelect" onChange={e=>{setTagToAdd(e.target.value)}}>
                        {tagItems}
                    </select>
                    <button type="button" className="ml-3 btn" onClick={addTag}>Add tag</button>
                    </div>
                    {selectedTags.length===0&&<p className="mt-2 ml-2 italic">No tags selected</p>}
                    <ol type="1" className="list-inside list-decimal">
                        {selectedTagItems}
                    </ol>
               
                </div>
                <div className="flex flex-row">
                    <label className="label mr-[7px]" htmlFor="accessibility"><span className=" text-base font-bold">Accessibility<span className="text-base text-red-600">*</span></span></label>
                    <input type="radio" name="accessibility" id="private" value="private"/><label htmlFor="private">Private (only you can access)</label>
                    <input defaultChecked type="radio" name="accessibility" id="public" value="public"/><label htmlFor="public">Public (anyone with link can access, but only you can modify)</label>
                </div>
                <div className="mt-3 mb-7 flex flex-row-reverse">
                <button className="btn ml-3 bg-red-600">Submit</button>
                <button type="button" className="btn bg-orange-400">Preview</button>   
                </div>
            </form>
        </>
    )
}