import { Squad } from "./squad";

export interface Match {
    id?:string,
    date:string,
    opponent:string,
    result:string,
    squad:Squad,
    coachId?:string
}
