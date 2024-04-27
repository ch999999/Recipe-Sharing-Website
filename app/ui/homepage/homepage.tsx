'use client'
import WelcomeNote from "./welcomeNote";
import HowToCreate from "./howToCreate";
import PlannedChanges from "./plannedChanges";

export default function HomePage({isLoggedIn}:{isLoggedIn:boolean}){
    if(!isLoggedIn){
        return (
        <>
        <WelcomeNote></WelcomeNote>
        <HowToCreate isLoggedIn={false}></HowToCreate>
        <PlannedChanges></PlannedChanges>
        </>
        )
    }else{
        return (
            <>
            <WelcomeNote></WelcomeNote>
            <HowToCreate isLoggedIn={true}></HowToCreate>
            <PlannedChanges></PlannedChanges>
            </>
            )
    }

}