'use client'

import { useState } from "react"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

export default function UtilityBar(){
    const [showPrintTooltip, setShowPrintTooltip] = useState(false);

    return(
    <div className="navbar min-h-[20px] sticky top-[68px] bg-gray-100 z-[9] border-t border-gray-200 print:hidden">
        <div className="flex-1">
            
        </div>
        <div className="flex-none -mt-3 -mb-3">
            <ul className="menu menu-horizontal px-1"><li><button>Print</button></li></ul>
            <ul><li>
            <div className="relative">
                        <InformationCircleIcon className="ml-1 w-6" onMouseEnter={()=>setShowPrintTooltip(true)} onMouseLeave={()=>setShowPrintTooltip(false)}></InformationCircleIcon>
                        {showPrintTooltip && <div className="absolute right-2 border-l-[5px] border-solid border-l-transparent border-r-[5px] border-r-transparent border-b-[20px] border-b-gray-600"></div>}
                        {showPrintTooltip && <p className=" bg-gray-600 text-white tooltip absolute w-60 z-10 right-1 top-[40px]">Hidden images will not show up on printing.</p>}
                    </div>    
            </li></ul>
        </div>
    </div>
    )
}