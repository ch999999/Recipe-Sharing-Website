import Link from "next/link"
export default function DeleteSuccess({title}:{title:string}){
    return (
        <div className="flex flex-col ml-2">
            <p className="text-xl font-bold">Recipe &apos;{title}&apos; was deleted successfully.</p>
            <Link href='/' className="text-blue-500 underline">Return to Home Page</Link>
            <Link href='/recipes/new' className="text-blue-500 underline">Create new recipe</Link>
        </div>
    )
}