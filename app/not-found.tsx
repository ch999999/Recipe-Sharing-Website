import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="text-center mt-[25%]">
      <p>You have been brought to this page because the resource you requested could not be found, or you do not have permission to access the resource. Signing in or signing in to a different account may grant you access to the resource.</p>
      <Link href="/">Return to Home Page</Link>
      <Link href="/users/login">Sign in</Link>
    </div>
  )
}