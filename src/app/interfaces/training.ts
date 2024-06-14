export interface Training {
    id?: string;            // ID opcional del entrenamiento.
    date?: string;          // Fecha opcional del entrenamiento.
    exercises?: string[];   // Lista opcional de ejercicios del entrenamiento.
    completed: boolean;     // Indica si el entrenamiento está completado o no.
    coachId?: string;       // ID opcional del entrenador asociado al entrenamiento.
}