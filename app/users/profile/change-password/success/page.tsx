import UpdateSuccess from "@/app/ui/intermediaries/updateSuccess";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RecipeKamu | Success",
    description: "This is a simple website that aims to provide users with the ability to easily create recipes, then share them via a simple link, or simply keep the link for their own reference. Operation successful.",
  };

export default function Page(){
    return <UpdateSuccess></UpdateSuccess>
}