import { HomeButton, UserButtons } from "./nav-buttons"

export default async function NavBar(){
    return(
    <div className="navbar sticky top-0 bg-gray-100 z-10">
        <div className="flex-1">
            <HomeButton/>
        </div>
        <div className="flex-none">
            <UserButtons/>
        </div>
    </div>
    )
}