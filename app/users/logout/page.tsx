'use client'

import { signoutUser } from "@/app/lib/actions";
import { useEffect } from "react";

export default async function Page(){
    useEffect(() => {
        signoutUser().then();
    }, []);
    return <div>Logging out...</div>
}