'use client'
import WelcomeNote from "./welcomeNote";
import HowToCreate from "./howToCreate";
import PlannedChanges from "./plannedChanges";
import UserRecipes from "./userRecipes";
import { Recipe } from "@/app/lib/definitions";

export default function HomePage({recipeList, isLoggedIn}:{recipeList:Recipe[]; isLoggedIn:boolean}){
    if(!isLoggedIn){
        return (
        <>
        <WelcomeNote></WelcomeNote>
        <HowToCreate isLoggedIn={false}></HowToCreate>
        <PlannedChanges></PlannedChanges>
        </>
        )
    }else if(isLoggedIn && recipeList.length<=0){
        return (
            <>
            <WelcomeNote></WelcomeNote>
            <HowToCreate isLoggedIn={true}></HowToCreate>
            <PlannedChanges></PlannedChanges>
            </>
            )
    }else{
        return (
            <>
                <UserRecipes recipeList={recipeList}></UserRecipes>
                <HowToCreate isLoggedIn={true}></HowToCreate>
                <PlannedChanges></PlannedChanges>
            </>
        )
    }

}