export default function validateLogin(login){
    if(!login.identifier || login.identifier.length<1){
        return {
            errorField: "identifier",
            message: "Username/email is required"
        }
    }

    if(login.identifier.length<3){
        return {
            errorField: "identifier",
            message: "Invalid username/email"
        }
    }

    if(!login.password || login.password.length<1){
        return {
            errorField: "password",
            message: "Password is required"
        }
    }
    return null;
}