import Link from 'next/link'
 
export default function NonexistantRecipeError() {
  return (
    <div className="p-1 flex flex-col">
      <p className="text-xl font-bold">Error: The recipe you are requesting does not exist.</p>
      <Link className="underline text-blue-500" href="/">Return to Home Page</Link>
      
    </div>
  )
}