import { User } from "@/app/lib/definitions";
import Link from "next/link";

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

export default function UserProfile({user}:{user:User}){

    return(
        <div>
            
                <h1 className="font-bold text-center text-xl">Your Profile</h1>
                <table className="flex justify-center">
                    <thead>
                        <tr>
                        <th className="hidden">Field</th>
                        <th className="hidden">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-text-top min-w-[89px]"><p className="font-bold">Username:</p></td>
                            <td className="max-w-[70vw] sm:max-w-[410px]"><div className="ml-2 break-words">{user.username}</div></td>
                        </tr>
                    
                        <tr>
                            <td className="align-text-top min-w-[89px]"><p className="font-bold">Email:</p></td>
                            <td className="max-w-[70vw] sm:max-w-[410px]"><div className="ml-2 break-words">{user.email}</div></td>
                        </tr>
                    
                        <tr>
                            <td className="align-text-top min-w-[89px]"><p className="font-bold">First Name:</p></td>
                            <td className="max-w-[70vw] sm:max-w-[410px]"><div className="ml-2 break-words">{user.firstname}</div></td>
                        </tr>
                    
                        <tr>
                            <td className="align-text-top min-w-[89px]"><p className="font-bold whitespace-nowrap">Last Name:</p></td>
                            <td className="max-w-[70vw] sm:max-w-[410px]"><div className="ml-2 break-words">{!user.lastname||user.lastname===""||user.lastname===null ? "-" : user.lastname}</div></td>
                        </tr>
                    
                        <tr>
                            <td className="align-text-top min-w-[89px]"><p className="font-bold">Password:</p></td>
                            <td className="max-w-[70vw] sm:max-w-[410px]"><div className="ml-2 break-words">*******</div></td>
                        </tr>

                        <tr>
                            <td className="align-text-top min-w-[89px]"><p className="font-bold">Joined:</p></td>
                            <td className="max-w-[70vw] sm:max-w-[410px]"><div className="ml-2 break-words">{utcToLocal(user.createdDate)}</div></td>
                        </tr>

                        <tr>
                            <td className="align-text-top min-w-[89px]"><p className="font-bold">Updated:</p></td>
                            <td className="max-w-[70vw] sm:max-w-[410px]"><div className="ml-2 break-words">{utcToLocal(user.lastModifiedDate)}</div></td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex justify-center flex-row">
                    <Link href='/users/profile/change-details' className="btn mr-1">Change Details</Link>
                    <Link href='/users/profile/change-password' className="btn ml-1">Change Password</Link>

                </div>
            
        </div>
    )
}