import Image from "next/image";
import { validateToken } from "./lib/auth";
import HomePage from "./ui/homepage/homepage";
import { GETUserRecipes } from "./api/recipes";

export default async function Home() {
  const tokenIsValid = await validateToken()
  let recipeList = []
  if(tokenIsValid){
    recipeList = await GETUserRecipes()
  }

  console.log(recipeList)
  return (
    <main className="flex min-h-screen flex-col mx-auto w-[97%] lg:max-w-[1100px]">
        <HomePage recipeList={recipeList} isLoggedIn={tokenIsValid}></HomePage>
    </main>
  );
}
