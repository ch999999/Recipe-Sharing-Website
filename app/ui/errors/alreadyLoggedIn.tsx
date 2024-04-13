import Link from 'next/link'
 
export default function CannotModifyRecipeError() {
  return (
    <div className="p-1 flex flex-col">
      <p className="text-xl font-bold">Error: You are already logged in. To access or create a different account, log out first. You can also use a different browser or a different browser profile to access a different account while staying logged in here.</p>
      <Link className="underline text-blue-500" href="/">Return to Home Page</Link>
    </div>
  )
}