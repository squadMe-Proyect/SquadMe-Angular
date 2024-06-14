import { Player } from "./player";

export interface Squad {
    id?: string;                        // ID opcional del escuadrón.
    name: string;                       // Nombre del escuadrón.
    lineUp?: '4-3-3' | '4-4-2' | '3-4-3'; // Formación táctica del equipo (opcional).
    players: Player[];                  // Lista de jugadores que conforman el escuadrón.
    coachId?: string;                   // ID opcional del entrenador asociado al escuadrón.
}