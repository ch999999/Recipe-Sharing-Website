
export type FormError = {
    errorField?: string|null,
    message?: string|null,
    index?:number|null
}

export type Recipe = {
    uuid?: string,
    title?:string,
    prep_Time_Mins:number,
    cook_Time_Mins:number,
    servings:number,
    createdDate?:Date,
    lastModifiedDate?:Date,
    isViewableByPublic?:boolean,
    ingredients?:Ingredient[],
    notes?:Note[]|null,
    instructions?:Instruction[],
    description?:string
}

export type Note = {
    uuid?:string,
    note_Number:number,
    description:string,
    recipeUUID?:string
}

export type Ingredient = {
    uuid?:string,
    ingredient_Number:number,
    recipeUUID?:string,
    description:string
}

export type Instruction = {
    uuid?:string,
    sequence_Number:number,
    description?:string,
    recipeUUID?:string,
    images?: Instruction_Image[]
}

export type Instruction_Image = {
    uuid?:string,
    image_Number?:number,
    url?:string,
    filename?:string,
    instructionUUID?:string,
    description?:string,
    imageBase64?:string,
    fileExtension?:string
}

export type Description_Image = {
    uuid?:string,
    url?:string,
    description?:string,
    filetype?:string,
    recipeUUID?:string,
    filename?:string,
    imageBase64?:string,
    fileExtension?:string
}

export type User = {
    uuid?:string,
    username?:string,
    firstname?:string,
    lastname?:string,
    email?:string,
    password?:string,
    createdDate?:Date,
    lastModifiedDate?:Date
}

export type Login = {
    identifier?:string,
    password?:string
}

