import { User } from "../definitions"

export default function validateNewUser(user:User){
    if(!user.firstname){
        return{
            errorField : "firstname",
            message: "Firstname is required"
        }
    }

    if(!user.password || !passwordIsValid(user.password)){
        return {
            errorField: "password",
            message:"Password must be at least 8 characters long and contain both alphabets and numeric characters"
        }
    }
    
    if(!user.email || !emailIsValid(user.email)){
        return {
            errorField:"email",
            message:"Invalid email"
        }
    }

    if(!user.username || user.username.length<1){
        return {
            errorField:"username",
            message: "Username cannot be empty"
        }
    }

    var usernameErrors = usernameIsValid(user.username)
    if(usernameErrors){
        return {
            errorField:"username",
            message:usernameErrors.message
        }
    }
    return null
}

export function passwordIsValid(password:string){
    if(password.length<8){
        return false
    }
    const atLeastOneLetterRegex = /[a-zA-Z]/;
    if(!atLeastOneLetterRegex.test(password)){
        return false
    }

    const atLeastOneNumberRegex = /[0-9]/
    if(!atLeastOneNumberRegex.test(password)){
        return false
    }
    return true
}

function emailIsValid(email:string){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return false
    }
    return true
}

function usernameIsValid(username:string){
    const alphaNRegex = /^[a-zA-Z0-9]+$/
    if(!alphaNRegex.test(username)){
        return {
            message: "Username can only contain alphanumeric characters"
        }
    }
    const firstChar = username[0]
    const letterRegex = /[a-zA-Z]/;
    if(!letterRegex.test(firstChar)){
        return {
            message: "Username must start with an alphabet"
        }
    }

    if(!(username.length>=3&&username.length<=20)){
        return {
            message: "Username must contain 3-20 characters"
        }
    }
    return null

}