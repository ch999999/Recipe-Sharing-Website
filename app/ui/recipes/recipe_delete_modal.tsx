import { deleteRecipe } from "@/app/lib/actions"
export default function DeletionModal({hide, recipeUUID, recipeTitle}){
    return(
        <>
        
        <div onClick={hide} className="fixed w-full min-h-screen bg-opacity-50 bg-gray-700 z-[4]">
        
        </div>
        <div className=" flex justify-center">
        <div className={"fixed bg-white z-[5] w-96 h-96 mt-[10%] p-2"}>
            <p className="text-center text-xl font-bold mb-1">Confirm Deletion</p>
            <p className=" text-center">Are you sure you want to delete this recipe? </p>
            <p className="text-center text-red-500">This action cannot be undone.</p>
            <div className="flex justify-center mt-1">
                <button className="btn bg-red-500 mr-1" onClick={()=>deleteRecipe(recipeUUID, recipeTitle)}>Yes, Delete</button>
                <button className="btn bg-green-500" onClick={hide}>No, Don&apos;t Delete</button>
            </div>
        </div>
        </div>
        </>
        
    )
}