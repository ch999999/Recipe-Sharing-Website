import Link from 'next/link'
 
export default function CannotModifyRecipeError() {
  return (
    <div className="p-1 flex flex-col">
      <p className="text-xl font-bold">Error: You do not have permission to modify this recipe. Only the owner of the recipe can modify</p>
      <Link className="underline text-blue-500" href="/">Return to Home Page</Link>      
    </div>
  )
}