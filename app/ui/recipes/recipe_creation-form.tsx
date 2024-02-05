'use client'
import { useFormState } from "react-dom"
import { useState } from "react"
import { useRef } from "react"


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

    const [dietToAdd, setDietToAdd] = useState(diets[0].name) 
    const [selectedDiets, setSelectedDiets] = useState([]) as any
    //const [ingredientToUpate, setIngredientToUpdate] = useState(0)
    const [ingredients, setIngredients] = useState([{id: 0, description: "Your first ingredient", quantity:0, unit:units[0].name}])
    const [instructions, setInstructions] = useState([{id: 0, description: "Your first instruction"}])
    const [selectedTags, setSelectedTags] = useState([]) as any
    const [tagToAdd, setTagToAdd] = useState(tags[0].name)
    const [notes, setNotes] = useState([]) as any
    const [descriptionImage, setDescriptionImage] = useState('No file chosen')

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
            return(<tbody key={i.id}>
                <tr>
                    <td><input name="instruction-description" placeholder={i.description}></input></td>
                    <td><input type="file" name="instruction-image"/></td>
                </tr>
            </tbody>)
        }else{
            return(<tbody key={i.id}>
                <tr>
                    <td><input name="instruction-description" placeholder={i.description}></input></td>
                    <td><input type="file" name="instruction-image"/></td>
                    <td><button className="btn" type="button" onClick={()=>removeInstruction(i.id)}>remove</button></td>
                </tr>
            </tbody>)
        }
        }
        )
    
    const noteItems = notes.map(n=>
        <li key={n.id}><input name="notes"></input><button type="button" onClick={()=>removeNote(n.id)} className="btn">remove</button></li>
        )

    const ingredientItems = ingredients.map(i=>
        {if(i.id===0){

            return  (<tbody key={i.id}><tr>
                        <td><input name="ingredient-description" placeholder={i.description}></input></td><td><input type="number" name="ingredient-quantity"></input></td>
                            <td>
                            <select name="ingredient-units">
                                {unitItems}
                            </select>
                            </td>
                    </tr></tbody>)
        }else{
            return (<tbody key={i.id}><tr>
                        <td><input name="ingredient-description" placeholder={i.description}></input></td><td><input type="number" name="ingredient-quantity"></input></td><td>
                        <select name="ingredient-units" >
                                {unitItems}
                        </select>
                        </td>
                        <td><button className="btn" type="button" onClick={()=>removeIngredient(i.id)}>remove</button></td>
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
        <li key={t.id}><input disabled name="tags" value={t.name}></input> <button type="button" onClick={()=>removeTag(t.id)} className="btn">remove</button></li>
        )

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
            {id: ingredientCount, name: "", quantity:0, unit:units[0].name}
        ])
    }

    function removeIngredient(id){
        setIngredients(
            ingredients.filter(i=>
                i.id!==id
                )
        )
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
            {id: instructionCount, description:""}
        ])
    }

    function removeInstruction(id){
        setInstructions(
            instructions.filter(i=>
                i.id!==id)
        )
    }

    return(
        
        <>
            <form className="ml-12 mr-12" onSubmit={test}>
                <div className="flex flex-row">
                    <label className="label mr-4" htmlFor="title"><span className="text-lg font-bold">Title<span className="text-base text-red-600">*</span></span></label>
                    <input type="text" name="title" className="input w-96"/>
                </div> 
                <div className="form-control">
                    <label className="label" htmlFor="description"><span className="text-lg font-bold">Description<span className="text-base text-red-600">*</span></span></label>
                    <textarea className="textarea textarea-bordered h-64" name="description"/> 
                </div> 
                <div className="">
                    <label className="label" ><span className="text-lg font-bold">Description Image:</span></label>
                    <input ref={descriptionImageRef} onChange={()=>setDescriptionImage(descriptionImageRef.current.files[0].name)} hidden type="file" name="description-image" id="description-image"/>
                    <label htmlFor="description-image" className="relative btn w-30">Choose Image</label>
                    <span className="ml-4 mr-4" id="file-chosen">{descriptionImage}</span>
                    {descriptionImage!=="No file chosen" && <button type="button" className="btn" onClick={()=>{descriptionImageRef.current.files=null; setDescriptionImage("No file chosen")}}>Remove</button>}
                </div> 
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
                <div className="flex flex-row">
                    <label className="label" htmlFor="prep-time"><span className="text-lg font-bold">Preperation Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <input type="number" name="prep-time" className=" ml-11 input input-bordered"/>
                </div> 
                <div className="mt-3 flex flex-row ">
                    <label className="label" htmlFor="cook-time"><span className="text-lg font-bold">Cook Time(minutes)<span className="text-base text-red-600">*</span></span></label>
                    <input type="number" name="cook-time" className=" ml-[99px] input input-bordered"/>
                </div>
                <div className="mt-3 flex flex-row ">
                    <label className="label" htmlFor="servings"><span className="text-lg font-bold">Servings<span className="text-base text-red-600">*</span></span></label>
                    <input type="number" name="servings" className="ml-12 w-36 input input-bordered"/>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="ingredients"><span className="label-text">Ingredients:</span></label>
                    <button type="button" className="btn" onClick={addIngredient}>Add Ingredient</button>
                    <table>
                        <thead>
                        <tr>
                            <th>Description</th><th>Quantity</th><th>Units</th>
                        </tr>
                        </thead>
                        
                        {ingredientItems}
                        
                    </table>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="instructions"><span className="label-text">Instructions:</span></label>
                    <button type="button" className="btn" onClick={addInstruction}>Add Instruction</button>
                    <table>
                        <thead>
                        <tr>
                            <th>Description</th><th>Image</th>
                        </tr>
                        </thead>
                        
                        {instructionItems}
                        
                    </table>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="notes"><span className="label-text">Notes:</span></label>
                    <button type="button" className="btn" onClick={addNote}>Add Note</button>
                    <ol type="1" className="list-inside list-decimal">
                        {noteItems}
                    </ol>
                </div>
                <div className="form-control">
                    <label htmlFor="tags"><span className="label-text">Tags</span></label>
                    <select name="tags" onChange={e=>{setTagToAdd(e.target.value)}}>
                        {tagItems}
                    </select>
                    <button type="button" className="btn" onClick={addTag}>Add tag</button>
                    <ol type="1" className="list-inside list-decimal">
                        {selectedTagItems}
                    </ol>
               
                </div>
                <button className="btn">submit</button>
            </form>
        </>
    )
}