import Form from "@/app/ui/login/login_form"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RecipeKamu | Sign in",
    description: "This is a simple website that aims to provide users with the ability to easily create recipes, then share them via a simple link, or simply keep the link for their own reference. Sign in to continue creating and sharing recipes",
  };

export default function Page(){
    return(
        <>
            <Form/>
        </>
    )
}