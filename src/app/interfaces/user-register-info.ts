export interface UserRegisterInfo{
    email:string,
    name:string,
    surname:string,
    password:string,
    teamName:string,
    nation:string,
    number:number,
    role:'ADMIN' | 'PLAYER'
}