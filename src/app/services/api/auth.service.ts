import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coach } from 'src/app/interfaces/coach';
import { Player } from 'src/app/interfaces/player';

/**
 * Servicio abstracto para manejar operaciones de autenticación.
 * Implementado por servicios concretos de autenticación.
 */
@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  /**
   * BehaviorSubject para seguir el estado de autenticación.
   * Emite `true` si está autenticado, `false` si no está autenticado, o `null` si es desconocido.
   */
  protected _connected = new BehaviorSubject<boolean|null>(null);

  /**
   * Observable para suscribirse a cambios en el estado de autenticación.
   * Emite `true` si está autenticado, `false` si no está autenticado, o `null` si es desconocido.
   */
  public isConnected$ = this._connected.asObservable();

  /**
   * BehaviorSubject para almacenar el usuario autenticado actualmente.
   * Emite `Coach`, `Player`, o `null` si no hay usuario autenticado.
   */
  protected _user = new BehaviorSubject<Coach|Player|null>(null);

  /**
   * Observable para suscribirse a cambios en el usuario autenticado.
   * Emite `Coach`, `Player`, o `null` si no hay usuario autenticado.
   */
  public user$ = this._user.asObservable();
  
  /**
   * Método abstracto para autenticar a un usuario basado en credenciales proporcionadas.
   * @param credentials Objeto que contiene las credenciales del usuario para iniciar sesión.
   * @returns Observable que emite el `Coach` o `Player` autenticado.
   */
  public abstract login(credentials: Object): Observable<Coach|Player>;

  /**
   * Método abstracto para registrar un nuevo usuario.
   * @param info Objeto que contiene la información de registro.
   * @returns Observable que emite el `Coach` o `Player` registrado.
   */
  public abstract register(info: Object): Observable<Coach|Player>;

  /**
   * Método abstracto para cerrar sesión del usuario autenticado.
   * @returns Observable que se completa al cerrar sesión exitosamente.
   */
  public abstract logout(): Observable<void>;

  /**
   * Método abstracto para obtener los detalles del usuario autenticado actualmente.
   * @returns Observable que emite los detalles del `Coach` o `Player`, o `null` si no está autenticado.
   */
  public abstract me(): Observable<Coach|Player|null>;

  /**
   * Método abstracto para actualizar los detalles del usuario autenticado actualmente.
   * @param user Información actualizada del usuario.
   * @returns Observable que se completa al actualizar exitosamente.
   */
  public abstract setUser(user: any): Observable<void>;

  /**
   * Método abstracto para iniciar el proceso de restablecimiento de contraseña.
   * @returns Observable que se completa al iniciar el restablecimiento de contraseña.
   */
  public abstract resetPassword(): Observable<void>;

  /**
   * Método abstracto para iniciar el proceso de restablecimiento de contraseña con un correo electrónico específico.
   * @param email Dirección de correo electrónico para la cual se solicita el restablecimiento de contraseña.
   * @returns Observable que se completa al iniciar el restablecimiento de contraseña.
   */
  public abstract resetPasswordWithEmail(email: string): Observable<void>;
}