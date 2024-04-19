export interface Player {
    id?:string,
    name:string,
    surname:string,
    position:string,
    email:string,
    nation:string,
    picture?:string | null,
    numbers?:number,
    assists?:number,
    yellowCards?:number,
    redCards?:number,
    role:string,
    coachId?:string,
    teamName:string
}