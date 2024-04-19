export interface Coach {
    id?:string,
    name:string,
    surname:string,
    email:string,
    teamName:string,
    nation:string,
    picture?:string | null,
    role:string
}