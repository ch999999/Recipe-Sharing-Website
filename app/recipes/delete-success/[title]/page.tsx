import DeleteSuccess from "@/app/ui/intermediaries/deleteSuccess";

export default function Page({params}:{params:{title:string}}){
    const title = decodeURIComponent(params.title)
    return <DeleteSuccess title={title}></DeleteSuccess>
}