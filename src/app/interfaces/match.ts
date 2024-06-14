import { Squad } from "./squad";

// Representa un objeto Match.
export interface Match {
    id?: string;          // ID opcional del partido.
    date: string;         // Fecha del partido (formato a definir, por ejemplo: "YYYY-MM-DD HH:mm").
    opponent: string;     // Nombre del oponente.
    result: string;       // Resultado del partido (por ejemplo, "3-2").
    squad: Squad;         // Información del escuadrón (equipo) utilizado en el partido.
    coachId?: string;     // ID opcional del entrenador asociado al partido.
    finished: boolean;    // Indica si el partido ha finalizado o no.
}