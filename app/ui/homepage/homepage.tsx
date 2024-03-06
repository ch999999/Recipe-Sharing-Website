'use client'
import Link from "next/link";

export default function HomePage({recipeList, isLoggedIn}){
    

    if(!isLoggedIn){
        return <div>Home Page</div>
    }else if(isLoggedIn && recipeList.length<=0){
        return <div>Please create some recipes</div>
    }else{
        let count = 0;
        const recipeItems = recipeList.map(r=>{
            count++;
            return(
            <>
            <tbody>
                <td >{count}</td>
                <td ><Link href={"/recipes/"+r.uuid}>{r.title}</Link></td>
                <td >{r.createdDate}</td>
                <td >{r.lastModifiedDate}</td>
            </tbody>
            </>
            )
        }
        )
        return (
            <>
                <p>Your Recipes: </p>
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
                </table>
            </>

        )
    }

}