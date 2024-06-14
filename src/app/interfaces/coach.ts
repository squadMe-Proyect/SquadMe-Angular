// Representa un objeto Coach con atributos opcionales.
export interface Coach {
    id?: string;            // ID opcional del coach.
    name: string;           // Nombre del coach.
    surname: string;        // Apellido del coach.
    email: string;          // Correo electrónico del coach.
    teamName: string;       // Nombre del equipo del coach.
    nation: string;         // Nacionalidad del coach.
    picture?: string | null; // URL de la imagen del coach (opcional).
    role: string;           // Rol del coach (por ejemplo, "coach").
}