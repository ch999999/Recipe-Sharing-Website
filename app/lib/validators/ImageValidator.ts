export default function ValidateImage(file:File){
    if(!isValidSize(file)){
        console.log("file size invalid")
        return{
            imageError: "Invalid file size",
            message: "Max. size 7MB allowed"
        }
    }
    if(!isImageType(file)){
        console.log("file type invalid")
        return {
            imageError: "Invalid file type",
            message: "Only images accepted" 
        }
    }
    console.log("file type ok")
    return null
}

function isImageType(file:File){
    if(file['type'].split('/')[0] === 'image'){
        return true
    }
    return false
}

function isValidSize(file:File){
    const maxSizeMB = 7
    const maxSize = 1024 * 1024 * maxSizeMB
    if(file.size > maxSize){
        return false;
    }
    return true;
}