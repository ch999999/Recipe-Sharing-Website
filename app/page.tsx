import Image from "next/image";
import { validateToken } from "./lib/auth";
import HomePage from "./ui/homepage/homepage";
import { GETUserRecipes } from "./api/recipes";
import { Suspense } from "react";
import Loading from "./ui/intermediaries/loading";
import RefreshRetry from "./ui/intermediaries/refreshRetry";


export default async function Home() {
  const tokenIsValid = await validateToken()
  let recipeList = []
  let refresh = false
  let isLoggedIn = false
  if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
    refresh = true
  }
  if(tokenIsValid.success===true){
    isLoggedIn = true
    recipeList = await GETUserRecipes()
  }

  
  if(refresh===false){
  return (
    <Suspense fallback={<Loading/>}>
    <main className="flex min-h-screen flex-col mx-auto w-[97%] lg:max-w-[1100px]">
        <HomePage recipeList={recipeList} isLoggedIn={isLoggedIn}></HomePage>
    </main>
    </Suspense>
  );
  }else{
    return <RefreshRetry nextPage={""}></RefreshRetry>
  }
}
