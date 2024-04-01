import Link from 'next/link'
 
export default function PrivateRecipeError() {
  return (
    <div className="p-1 flex flex-col">
      <p className="text-xl font-bold">Error: The recipe you are requesting is a private recipe not belonging to your account. If you know the owner, ask them to grant you access. If you own the account, sign in to it and try again.</p>
      <Link className="underline text-blue-500" href="/">Return to Home Page</Link>
      <Link className="underline text-blue-500" href="/users/login">Sign in</Link>
    </div>
  )
}