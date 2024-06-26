
'use client'
import Link from "next/link";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { Recipe } from "@/app/lib/definitions";

function utcToLocal(utcDateTimeString:Date|undefined){
    if(!utcDateTimeString){
        return "error loading date"
    }
    const utcDateTime = new Date(utcDateTimeString)
    const date = utcDateTime.getDate()
    const month = utcDateTime.getMonth()+1
    const year = utcDateTime.getFullYear()
    return date+'/'+month+'/'+year
}

export default function UserRecipes({recipeList}:{recipeList:Recipe[]}){
    function copyToClipboard(uuid:string){
        navigator.clipboard.writeText(process.env.NEXT_PUBLIC_DOMAIN+"/recipes/"+uuid )
    }

    if(recipeList.length>0){
        let count = 0;
        const recipeItems = recipeList.map(r=>{
            count++;
            return(
            
            <tbody key={r.uuid} className="border border-gray-300">
                <tr className="border border-gray-300">
                <td className="text-center align-top border border-gray-300">{count+"."}</td>
                <td className="border border-gray-300 w-fit"><div className="ml-1"><span className="font-semibold">{r.title}</span><br></br>
                    <div className="md:flex md:flex-row "><div>Link: <Link href={"/recipes/"+r.uuid}><span className="underline text-blue-500">{process.env.NEXT_PUBLIC_DOMAIN+"/recipes/"+r.uuid}</span></Link><button onClick={()=>{if(!r.uuid){return} copyToClipboard(r.uuid)}} className="align-middle mb-1 ml-1"><ClipboardIcon className="w-5"></ClipboardIcon></button></div></div>
                    <span className="md:hidden">Created: {utcToLocal(r.createdDate)}</span>
                    <br className="md:hidden"></br><span className="md:hidden">Modified: {utcToLocal(r.lastModifiedDate)}</span>
                    </div>
                </td>
                <td className=" text-center border border-gray-300 hidden md:table-cell">{utcToLocal(r.createdDate)}</td>
                <td className="text-center border border-gray-300 hidden md:table-cell">{utcToLocal(r.lastModifiedDate)}</td>
                </tr>
            </tbody>
            
            )
        }
        )
        return (
            <>
                <h1 className="text-xl font-bold text-center sm:text-2xl">Your Recipes</h1>
                <table className="border border-gray-300 w-full">
                        <thead>
                        <tr className="border border-gray-300">
                            <th className="border border-gray-300 hidden md:table-cell">No.</th>
                            <th className="border border-gray-300 hidden md:table-cell"><span className="">Recipe</span></th>
                            <th className="border border-gray-300 hidden md:table-cell">Date Created</th>
                            <th className="border border-gray-300 hidden md:table-cell">Date Modified</th>
                        </tr>
                        </thead>
                        {recipeItems}
                        
                </table>
            </>

        )
    }else{
        return <h1 className="text-xl font-bold text-center sm:text-2xl">You don&apos;t have any recipes.</h1>
    }
}