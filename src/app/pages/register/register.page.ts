import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { UserRegisterInfo } from 'src/app/interfaces/user-register-info';
import { AuthService } from 'src/app/services/api/auth.service';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';
import { CoachService } from 'src/app/services/model/coach.service';

/**
 * Página para registrar nuevos usuarios.
 * Permite registrar un usuario nuevo y manejar errores de registro.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  /**
   * Constructor de RegisterPage.
   * @param auth Servicio de autenticación (`AuthService`).
   * @param cSvc Servicio para gestionar entrenadores (`CoachService`).
   * @param router Enrutador de Angular (`Router`).
   * @param toast Controlador de toasts (`ToastController`).
   * @param translate Servicio para traducciones personalizadas (`CustomTranslateService`).
   */
  constructor(
    private auth: AuthService,
    private cSvc: CoachService,
    private router: Router,
    private toast: ToastController,
    public translate: CustomTranslateService
  ) { }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializarse el componente.
   */
  ngOnInit() {
  }

  /**
   * Registra un nuevo usuario.
   * @param info Información del usuario a registrar.
   */
  onRegister(info: UserRegisterInfo) {
    this.auth.register(info).subscribe({
      next: (user) => {
        user.role = 'ADMIN'; // Asignar el rol de administrador al usuario registrado
        this.cSvc.createCoach(user).subscribe(); // Crear un nuevo entrenador asociado al usuario
        this.router.navigate(['/home']); // Navegar a la página de inicio después del registro exitoso
      },
      error: async (err: any) => {
        console.log(err); // Imprimir el error en la consola para propósitos de depuración

        // Manejar errores específicos de registro
        if (err.code == "auth/email-already-in-use") {
          const messageKey = 'register.error.existingEmail';
          const message = await lastValueFrom(this.translate.get(messageKey));
          const options: ToastOptions = {
            message: message,
            duration: 1000,
            position: 'bottom',
            color: 'danger',
            cssClass: 'red-toast'
          };
          this.toast.create(options).then(toast => toast.present()); // Mostrar mensaje de error como un toast
        } else if (err.code == "auth/invalid-email") {
          const messageKey = 'register.error.invalidEmail';
          const message = await lastValueFrom(this.translate.get(messageKey));
          const options: ToastOptions = {
            message: message,
            duration: 1000,
            position: 'bottom',
            color: 'danger',
            cssClass: 'red-toast'
          };
          this.toast.create(options).then(toast => toast.present()); // Mostrar mensaje de error como un toast
        } else {
          const messageKey = 'register.error.errorToRegister';
          const message = await lastValueFrom(this.translate.get(messageKey));
          const options: ToastOptions = {
            message: message,
            duration: 1000,
            position: 'bottom',
            color: 'danger',
            cssClass: 'red-toast'
          };
          this.toast.create(options).then(toast => toast.present()); // Mostrar mensaje de error como un toast
        }
      }
    });
  }
}
