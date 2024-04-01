'use client'
import Link from "next/link";
import WelcomeNote from "./welcomeNote";
import HowToCreate from "./howToCreate";
import PlannedChanges from "./plannedChanges";
import UserRecipes from "./userRecipes";
import { useEffect } from "react";
import { fetchUserRecipes, redirectToLogin } from "@/app/lib/actions";
import { tokenRefresh } from "@/app/lib/actions";
import { useState } from "react";

export default function HomePage({recipeList, isLoggedIn}){
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
        // let count = 0;
        // const recipeItems = recipeList.map(r=>{
        //     count++;
        //     return(
        //     <>
        //     <tbody>
        //         <tr>
        //         <td >{count}</td>
        //         <td ><Link href={"/recipes/"+r.uuid}>{r.title}</Link></td>
        //         <td >{r.createdDate}</td>
        //         <td >{r.lastModifiedDate}</td>
        //         </tr>
        //     </tbody>
        //     </>
        //     )
        // }
        //)
        return (
            <>
                {/* <p>Your Recipes: </p>
                <table className="">
                        <thead>
                        <tr className="">
                            <th className="">No.</th>
                            <th className=""><span className="">Title</span></th>
                            <th className="">Date Created</th>
                            <th>Date Modified</th>
                        </tr>
                        </thead>
                        {recipeItems}
                </table> */}
                <UserRecipes recipeList={recipeList}></UserRecipes>
                
        <HowToCreate isLoggedIn={true}></HowToCreate>
        <PlannedChanges></PlannedChanges>
            </>

        )
    }

}