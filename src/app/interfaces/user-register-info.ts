export interface UserRegisterInfo {
    email: string;                           // Correo electrónico del usuario.
    name: string;                            // Nombre del usuario.
    surname: string;                         // Apellido del usuario.
    password: string;                        // Contraseña del usuario.
    teamName: string;                        // Nombre del equipo del usuario.
    nation: string;                          // Nación del usuario.
    number: number;                          // Número del usuario.
    role: 'ADMIN' | 'PLAYER';                // Rol del usuario (administrador o jugador).
}