import { HomeButton, UserButtons } from "./nav-buttons"

export default async function NavBar(){
    return(
    <div className="navbar bg-base-100 sticky top-0">
        <div className="flex-1">
            <HomeButton/>
        </div>
        <div className="flex-none">
            <UserButtons/>
        </div>
    </div>
    )
}