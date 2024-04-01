import { refreshToken } from "@/app/api/users"
import { validateToken } from "@/app/lib/auth"
import RefreshRetry from "@/app/ui/intermediaries/refreshRetry"
import Form from "@/app/ui/recipes/recipe_creation_form_mobile_proportionate"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"




export default async function Page(){
    const tokenIsValid = await validateToken()
    let refresh = false
    
    if(tokenIsValid.tryRefresh&&tokenIsValid.tryRefresh===true){
        refresh = true
    }
    if(tokenIsValid.success===false&&tokenIsValid.tryRefresh===false){
        revalidatePath('/users/login?next='+"recipes/new");
        redirect('/users/login/?next='+"recipes/new")
    }
    
    if(refresh===false){
    return (
        <>      
            <Form></Form> 
        </>
    )
    }else{
        return <RefreshRetry nextPage={"recipes/new"}></RefreshRetry>
    }
}