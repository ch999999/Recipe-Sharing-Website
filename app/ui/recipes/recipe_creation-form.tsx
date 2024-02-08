'use client'
import { useFormState } from "react-dom"
import { useState } from "react"
import { useRef } from "react"
import { useEffect } from "react"


const diets = [
    {id: 0, name: "Vegan"},
    {id: 1, name: "Carnivore"},
    {id: 2, name: "Keto"}
]

const difficulties = [
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

const tags = [
    {id: 0, name: "Chicken"},
    {id: 1, name: "Rice"},
    {id: 2, name: "Sugar"}
]

const cuisines = [
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

export default function Form(){
    const descriptionImageRef = useRef(null)
    const instructionImagesRef = useRef(null)

    const [dietToAdd, setDietToAdd] = useState(diets[0].name) 
    const [selectedDiets, setSelectedDiets] = useState([]) as any
    //const [ingredientToUpate, setIngredientToUpdate] = useState(0)
    const [ingredients, setIngredients] = useState([{id: 0, description: "Your first ingredient", quantity:0, unit:units[0].name, order:1}])
    const [instructions, setInstructions] = useState([{id: 0, description: "Your first instruction", order:1, imageFileName:"No file chosen", fileChosen: false, imageButtonText: "Choose Image"}])
    const [selectedTags, setSelectedTags] = useState([]) as any
    const [tagToAdd, setTagToAdd] = useState(tags[0].name)
    const [notes, setNotes] = useState([]) as any
    const [descriptionImage, setDescriptionImage] = useState({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})

    const cusineItems = cuisines.map(c=>
        <option key={c.id} value={c.name}>{c.name}</option>
        )

    const tagItems = tags.map(t=>
        <option key={t.id}>{t.name}</option>
        )

    const unitItems = units.map(u=>
        <option key={u.id}>{u.name}</option>
        )

    const difficultyItems = difficulties.map(d=>
        <option key={d.id} value={d.name}>{d.name}</option>
        )

    const instructionItems = instructions.map(i=>
        {if(i.id===0){
            return(<tbody className=" border border-gray-300" key={i.id}>
                <tr className=" border border-gray-300">
                    <td className="border border-gray-300"><p className="w-8 text-center">{i.order}</p></td>
                    <td className="border border-gray-300"><textarea className="w-[600px] p-1 rounded h-20" name="instruction-description" placeholder={i.description}></textarea></td>
                    <td className="border border-gray-300">
                        <div className="w-[349px] flex flex-row">
                        <input ref={(node)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>updateInstructionImage(i.id)} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 min-w-[180px] max-w-[180px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 text-red-700 text-3xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                    </td>
                    <td className=" border border-gray-300"><button className="btn" type="button" disabled>Remove</button></td>
                </tr>
            </tbody>)
        }else{
            return(<tbody key={i.id}>
                <tr className="border border-gray-300">
                    <td className="border border-gray-300"><p className="w-8 text-center">{i.order}</p></td>
                    <td className="border border-gray-300"><textarea className="w-[600px] p-1 rounded h-20" name="instruction-description" placeholder={i.description}></textarea></td>
                    <td className="border border-gray-300">
                    <div className="w-[349px] flex flex-row">
                        <input ref={(node)=>{const map=getMap(); if(node){map.set(i.id, node);}else{map.delete(i.id)}}} onChange={()=>updateInstructionImage(i.id)} hidden type="file" name="instruction-image" id={"instruction-image-"+i.id}/>
                        <label htmlFor={"instruction-image-"+i.id} className="relative btn w-30">{i.imageButtonText}</label>
                        <p className="mt-3 min-w-[180px] max-w-[180px] ml-2 whitespace-nowrap overflow-hidden overflow-ellipsis" id="file-chosen">{i.imageFileName}</p>
                        {i.fileChosen && <button type="button" className="ml-2 text-red-700 text-3xl" onClick={()=>removeInstructionImageFile(i.id)}>&times;</button>}
                        </div>
                    </td>
                    <td className="border border-gray-300"><button className="btn" type="button" onClick={()=>{removeInstruction(i.id)}}>remove</button></td>
                </tr>
            </tbody>)
        }
        }
        )
    
    const noteItems = notes.map(n=>
        <li className="mt-3" key={n.id}><input className="ml-2 mr-2 w-[520px] input bg-slate-200" name="notes"></input><button type="button" onClick={()=>removeNote(n.id)} className="btn">remove</button></li>
        )

    const ingredientItems = ingredients.map(i=>
        {if(i.id===0){

            return  ( <tbody className=" border border-gray-300" key={i.id}><tr className="border border-gray-300">
                        <td className="border border-gray-300"><p className="w-8 text-center">{i.order}</p></td>
                        <td className=" border border-gray-300"><textarea className=" w-[600px] p-1 rounded resize-none" name="ingredient-description" placeholder={i.description}></textarea></td><td><input className="input w-[172px]" type="number" name="ingredient-quantity"></input></td>
                            <td className=" border border-gray-300">
                            <select className="select" name="ingredient-units">
                                {unitItems}
                            </select>
                            </td>
                            <td className=" border border-gray-300"><button className=" btn" type="button" disabled>Remove</button></td>
                    </tr></tbody>)
        }else{
            return (<tbody className=" border border-gray-300" key={i.id}><tr className="border border-gray-300">
                        <td className="border border-gray-300"><p className="w-8 text-center">{i.order}</p></td>
                        <td className=" border border-gray-300"><textarea className=" w-[600px] p-1 rounded resize-none" name="ingredient-description" placeholder={i.description}></textarea></td><td className=" border border-gray-300"><input className="input w-[172px]" type="number" name="ingredient-quantity"></input></td>
                        <td className="border border-gray-300">
                        <select className="select" name="ingredient-units" >
                                {unitItems}
                        </select>
                        </td>
                        <td className=" border border-gray-300"><button className="btn" type="button" onClick={()=>{removeIngredient(i.id)}}>remove</button></td>
            </tr></tbody>)
        }}
        
        //<li key={i.id}><input name="ingredients" value={i.description}></input><button type="button">remove</button></li>
        )

    const dietItems = diets.map(diet =>
        <option key={diet.id}>{diet.name}</option>
      );

    const selectedDietItems = selectedDiets.map(diet=>
        
        <li className="mt-3" key={diet.id}><input disabled name="diets" value={diet.name}></input> <button type="button" onClick={()=>removeDiet(diet.id)} className="btn -ml-3">remove</button></li>
            
        ) 
    //  const inputs = selectedDiets.map(diet=>
    //     <input key={diet.id} name="diets">{diet.name}</input>
    //     )

    const selectedTagItems = selectedTags.map(t=>
        <li className="mt-2" key={t.id}><input disabled name="tags" value={t.name}></input> <button type="button" onClick={()=>removeTag(t.id)} className="btn -ml-5">remove</button></li>
        )

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
        const nextInstructions = instructions.map(i=>{
            if(i.id === id){
                return{
                    ...i,
                    imageFileName: node.files[0].name,
                    fileChosen: true,
                    imageButtonText: "Repick Image"
                }
            }else{
                return i
            }
        })

        setInstructions(nextInstructions)
    }

    function addNote(){
        notesCount++;
        setNotes([
            ...notes,
            {id: notesCount, description:""}
        ])
    }

    function removeNote(id){
        setNotes(
            notes.filter(n=>
                n.id!==id
                )
        )
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
            {id: ingredientCount, name: "", quantity:0, unit:units[0].name, order: ingredients.length+1}
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
        setSelectedTags([
            ...selectedTags,
            {id: tagToAdd, name: tagToAdd}
        ]);
    }

    function addDiet(){
        //setSelectedDiets([...selectedDiets,{id:9, name: selectedDiet}]);
        const dietExists = selectedDiets.find(({ name }) => name === dietToAdd);
        if(dietExists){
            return;
        }
        setSelectedDiets([
            ...selectedDiets,
            { id: dietToAdd, name: dietToAdd }
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

    return(
        <>
            <form className="mb-20 mx-auto w-[1117px] border rounded-lg border-gray-400 p-4" onSubmit={test}>
                <div className="flex flex-row">
                    <label className="label mr-[66px]" htmlFor="title"><span className="text-lg font-bold">Title<span className="text-base text-red-600">*</span></span></label>
                    <input type="text" name="title" className="input w-96"/>
                </div> 
                <div className="form-control">
                    <label className="label" htmlFor="description"><span className="text-lg font-bold">Description<span className="text-base text-red-600">*</span></span></label>
                    <textarea className="textarea w-[1085px] textarea-bordered h-48" name="description"/> 
                </div> 
                <div className="">
                    <label className="label" ><span className="text-lg font-bold">Description Image:</span></label>
                    <input ref={descriptionImageRef} onChange={()=>{setDescriptionImage({name: descriptionImageRef.current.files[0].name, fileChosen: true, buttonText:"Repick Image"})}} hidden type="file" name="description-image" id="description-image"/>
                    <label htmlFor="description-image" className="relative btn w-30">{descriptionImage.buttonText}</label>
                    <span className="ml-4 mr-4" id="file-chosen">{descriptionImage.name}</span>
                    {descriptionImage.fileChosen && <button type="button" className="btn" onClick={()=>{descriptionImageRef.current.files=null; setDescriptionImage({name: "No file chosen", fileChosen: false, buttonText: "Choose Image"})}}>Remove</button>}
                </div> 

                <section className="flex flex-col lg:flex-row">
                <section>
                <div className="mt-3 flex flex-row">
                    <label className="label mr-10" htmlFor="difficulty"><span className="text-lg font-bold">Difficulty<span className="text-base text-red-600">*</span></span></label>
                    <select className="select w-36" name="difficulty">
                        {difficultyItems}
                    </select>
                </div>
                <div className="mt-3 flex flex-row">
                    <label className="label mr-16" htmlFor="cuisine"><span className="text-lg font-bold">Cuisine</span></label>
                    <select className="select w-36" name="cusine">
                        {cusineItems}
                    </select>
                </div>
                <div className="mt-3 flex flex-col">
                    <div className="flex flex-row">
                    <label className="label mr-[82px]" htmlFor="diets"><span className="text-lg font-bold">Diets</span></label>
                    <select className="select w-36" name="diets" onChange={e=>{setDietToAdd(e.target.value)}}>
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

                <section className="lg:ml-[282px]">
                <div className="flex flex-row">
                    <label className="label mr-10" htmlFor="prep-time"><span className="text-lg font-bold">Preperation Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <input type="number" name="prep-time" className="w-36 input input-bordered"/>
                </div> 
                <div className="mt-3 flex flex-row ">
                    <label className="label mr-24" htmlFor="cook-time"><span className="text-lg font-bold">Cook Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <input type="number" name="cook-time" className="  w-36 input input-bordered"/>
                </div>
                <div className="mt-3 flex flex-row ">
                    <label className="label" htmlFor="servings"><span className="text-lg font-bold">Servings<span className="text-base text-red-600">*</span></span></label>
                    <input type="number" name="servings" className=" ml-[162px] lg:ml-[196px] w-36 input input-bordered"/>
                </div>
                </section>
                </section>

                <div className="flex flex-col">
                    <div className="mt-3 flex flex-row">
                    <label className="label" htmlFor="ingredients"><span className="text-lg font-bold">Ingredients<span className="text-base text-red-600">*</span></span></label>
                    <button type="button" className="ml-5 w-36 btn bg-gray-100" onClick={addIngredient}>Add Ingredient</button>
                    </div>

                    <table className="table-auto w-[1085px] mt-3 border border-gray-300">
                        <thead className="">
                        <tr className="border border-gray-300">
                            <th className=" border border-gray-300"></th><th className=" border border-gray-300"><span className="text-lg font-bold">Ingredient description</span></th><th className="border border-gray-300">Quantity</th><th className="border border-gray-300">Units</th><th className="border border-gray-300"></th>
                        </tr>
                        </thead>
                        
                        {ingredientItems}
                        
                    </table>
                </div>
                <div className="form-control">
                    <div className="mt-3 flex flex-row">
                    <label className="label" htmlFor="ingredients"><span className="text-lg font-bold">Instructions<span className="text-base text-red-600">*</span></span></label>
                    <button type="button" className="ml-5 w-36 btn bg-gray-100" onClick={addInstruction}>Add Instruction</button>
                    </div>

                    <table className="table-auto w-[1085px] mt-3 border border-gray-300">
                        <thead>
                        <tr className="border border-gray-300">
                            <th className="border border-gray-300"></th><th className=" border border-gray-300"><span className="text-lg font-bold">Instruction</span></th><th className=" border border-gray-300"><span className="text-lg font-bold">Image</span></th><th className="border border-gray-300"></th>
                        </tr>
                        </thead>
                        
                        {instructionItems}
                        
                    </table>
                </div>
                <div className="mt-3 flex flex-col">
                    <div className="flex flex-row">
                    <label className="label mr-[71px]" htmlFor="notes"><span className="text-lg font-bold">Notes</span></label>
                    <button type="button" className=" w-36 btn" onClick={addNote}>Add Note</button>
                    </div>
                    {notes.length===0&&<p className="mt-2 ml-2 italic">No notes added</p>}
                    <ol type="1" className="list-inside list-decimal">
                        {noteItems}
                    </ol>
                </div>
                <div className="mt-3 flex flex-col">
                    <div className="flex flex-row">
                    <label className="label mr-[82px]" htmlFor="tags"><span className="text-lg font-bold">Tags</span></label>
                    <select className="select w-36 bg-slate-300" name="tags" onChange={e=>{setTagToAdd(e.target.value)}}>
                        {tagItems}
                    </select>
                    <button type="button" className="ml-3 btn" onClick={addTag}>Add tag</button>
                    </div>
                    {selectedTags.length===0&&<p className="mt-2 ml-2 italic">No tags selected</p>}
                    <ol type="1" className="list-inside list-decimal">
                        {selectedTagItems}
                    </ol>
               
                </div>
                <div className="mt-3 mb-7 flex flex-row-reverse">
                <button className="btn ml-3 bg-red-600">Submit</button>
                <button type="button" className="btn bg-orange-400">Preview</button>   
                </div>
            </form>
        </>
    )
}