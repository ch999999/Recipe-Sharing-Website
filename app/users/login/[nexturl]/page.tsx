import Form from "@/app/ui/login/login_form_customnav"

export default function Page({params}:{params:{nexturl:string}}){
    
    return(
        <>
            <Form nexturl={params.nexturl}/>
        </>
    )
}