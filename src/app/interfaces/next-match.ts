import { Squad } from "./squad";

export interface NextMatch {
    id?:string,
    date:string,
    opponent:string,
    result:string,
    squad:Squad
}
