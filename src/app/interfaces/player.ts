// Representa un objeto Player.
export interface Player {
    id?: string;             // ID opcional del jugador.
    name: string;            // Nombre del jugador.
    surname: string;         // Apellido del jugador.
    position: string;        // Posición del jugador (por ejemplo, "Delantero", "Defensa", etc.).
    email: string;           // Correo electrónico del jugador.
    nation: string;          // Nacionalidad del jugador.
    picture?: string | null; // URL de la imagen del jugador (opcional, puede ser `null`).
    number: number;          // Número de camiseta del jugador.
    goals?: number;          // Número de goles marcados por el jugador (opcional).
    assists?: number;        // Número de asistencias realizadas por el jugador (opcional).
    yellowCards?: number;    // Número de tarjetas amarillas recibidas por el jugador (opcional).
    redCards?: number;       // Número de tarjetas rojas recibidas por el jugador (opcional).
    role: string;            // Rol del jugador (por ejemplo, "player").
    coachId?: string;        // ID opcional del entrenador asociado al jugador.
    teamName: string;        // Nombre del equipo al que pertenece el jugador.
}