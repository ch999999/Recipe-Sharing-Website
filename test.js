let c = "e"
console.log(Number(c))


// let ingredientCount = 5
// const ingredients = [{id:1, name:"one", order:1},{id:2, name:"two", order:2},{id:3, name:"three", order:3},{id:4, name:"four",order:4},{id:5, name:"five",order:5}]


// function addIngredientBelow(idd){
//         const indexToAddBelow= ingredients.findIndex(({id})=>id===idd)
        
//         console.log(indexToAddBelow)
//         ingredientCount++
//         const nextIngredients = [...ingredients.slice(0, indexToAddBelow+1),
//         {id:ingredientCount, name:"name", order:0},
//         ...ingredients.slice(indexToAddBelow+1)]
//         //reorder based on array index
//         for(let j=0; j<nextIngredients.length; j++){
//           nextIngredients[j].order = j+1
//         }
//         console.log(nextIngredients)
// }

// function moveIngredientUp(Id){
//   console.log(ingredients)
//   const ingredientToMoveUp = ingredients.find(({id})=>id===Id)
//   if(ingredientToMoveUp.order<=1){
//       return
//   }
//   const ingredientAbove = ingredients.find(({order})=>order===ingredientToMoveUp.order-1)
//   const nextIngredients = [...ingredients]
//   nextIngredients[ingredientToMoveUp.order-1] = ingredientAbove
//   nextIngredients[ingredientAbove.order-1] = ingredientToMoveUp
//   //reorder based on array index
//   for(let j=0; j<nextIngredients.length; j++){
//       nextIngredients[j].order = j+1
//   }
//   console.log(nextIngredients)
// }

// function moveIngredientDown(Id){
//   console.log(ingredients)
//   const ingredientToMoveDown = ingredients.find(({id})=>id===Id)
//   if(ingredientToMoveDown.order>=ingredients.length){
//       return
//   }
//   const ingredientBelow = ingredients.find(({order})=>order===ingredientToMoveDown.order+1)
//   const nextIngredients = [...ingredients]
//   nextIngredients[ingredientToMoveDown.order-1] = ingredientBelow
//   nextIngredients[ingredientBelow.order-1] = ingredientToMoveDown
//   //reorder based on array index
//   for(let j=0; j<nextIngredients.length; j++){
//       nextIngredients[j].order = j+1
//   }
//   console.log(nextIngredients)
// }

// moveIngredientDown(5)