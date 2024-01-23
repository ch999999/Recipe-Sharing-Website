export type User = {
    id?: string,
    username?: string,
    email?: string,
    password?: string
}

export type FormError = {
    field?: string,
    message?: string
}