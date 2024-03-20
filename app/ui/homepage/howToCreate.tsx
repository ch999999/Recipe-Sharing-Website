import Link from "next/link"

export default function HowToCreate({isLoggedIn}){
    return(
        <>
            <div className="mt-2">
            <h2 className="font-bold text-xl">How to create and share a recipe</h2>
            
            <table className="table-auto">
                <thead>
                    <tr>
                        <th className="hidden">No.</th>
                        <th className="hidden">Instruction</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div>1.</div>
                        </td>
                        <td>
                            <p>You must be signed in to create a recipe. Create an account 
                                 <Link href="/users/signup" rel="noopener noreferrer" target="_blank"> <span className=" text-blue-500 underline">here</span> </Link> 
                                or sign in <Link href="/users/login" rel="noopener noreferrer" target="_blank"><span className=" text-blue-500 underline">here</span></Link></p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div>2.</div>
                        </td>
                        <td>
                            <p>Click on Create Recipe or click <Link href={isLoggedIn ? "/recipes/new" : "/users/signup"} rel="noopener noreferrer" target="_blank"> <span className=" text-blue-500 underline">here</span> </Link>  to access the recipe creation page</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div>3.</div>
                        </td>
                        <td>
                            <p>Fill in the recipe creation form. If you want to share it with other people, make sure to select &quot;public&quot; in accessibility settings.</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">
                            <div>4.</div>
                        </td>
                        <td>
                            <p>Press submit at the bottom of the form</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">    
                            <div>5.</div>
                        </td>
                        <td>
                            <p>On successful recipe creation, you will be redirected to a page showcasing your recipe</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">    
                            <div>6.</div>
                        </td>
                        <td>
                            <p>Copy the link and share via your preferred social media platform, or keep it for your own reference</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="min-w-5 align-top">    
                            <div>7.</div>
                        </td>
                        <td>
                            <p>You can find a list of your recipes on this page({window.location.host}), once you have created at least one recipe and are signed in.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            </div>
        </>
    )
}