import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput, IonPopover, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { UserCredentials } from 'src/app/interfaces/user-credentials';
import { AuthService } from 'src/app/services/api/auth.service';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';

/**
 * Componente LoginPage.
 * Este componente maneja la lógica para la página de inicio de sesión.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isOpen: boolean = false;

  /**
   * Constructor del componente LoginPage.
   * @param auth Servicio de autenticación (`AuthService`).
   * @param router Router de navegación (`Router`).
   * @param toast Controlador de toasts (`ToastController`).
   * @param translate Servicio para traducciones personalizadas (`CustomTranslateService`).
   */
  constructor(
    public auth: AuthService,
    private router: Router,
    private toast: ToastController,
    public translate: CustomTranslateService
  ) { }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializarse el componente.
   */
  ngOnInit() { }

  /**
   * Maneja el evento de inicio de sesión.
   * @param credentials Credenciales de usuario (`UserCredentials`).
   */
  onLogin(credentials: UserCredentials) {
    this.auth.login(credentials).subscribe({
      next: (user: any) => {
        console.log(user);
        this.router.navigate(['/home']);
      },
      error: async (err: any) => {
        const message = await lastValueFrom(this.translate.get('login.error.badCredentials'));
        const options: ToastOptions = {
          message: message,
          duration: 1000,
          position: 'bottom',
          color: 'danger',
          cssClass: 'red-toast'
        };
        this.toast.create(options).then(toast => toast.present());
        console.error(err);
      }
    });
  }

  /**
   * Establece el estado del popover.
   * @param open `true` para abrir el popover, `false` para cerrarlo.
   */
  setOpen(open: boolean) {
    this.isOpen = open;
  }

  /**
   * Cambia la contraseña del usuario con el correo electrónico proporcionado.
   * @param popover Instancia del popover de Ionic (`IonPopover`).
   * @param input Instancia del input de Ionic (`IonInput`) que contiene el correo electrónico.
   */
  async changePassword(popover: IonPopover, input: IonInput) {
    if (input.value) {
      this.auth.resetPasswordWithEmail(input.value.toString()).subscribe({
        next: async (_: any) => {
          popover.dismiss();
          const message = await lastValueFrom(this.translate.get('user-card.password-message'));
          const options: ToastOptions = {
            message: message,
            duration: 1000,
            position: 'bottom',
            color: 'tertiary',
            cssClass: 'red-toast'
          };
          this.toast.create(options).then(toast => toast.present());
        },
        error: async (err: any) => {
          const message = await lastValueFrom(this.translate.get('register.error.invalidEmail'));
          const options: ToastOptions = {
            message: message,
            duration: 1000,
            position: 'bottom',
            color: 'danger',
            cssClass: 'red-toast'
          };
          this.toast.create(options).then(toast => toast.present());
        }
      });
    } else {
      const message = await lastValueFrom(this.translate.get('login.error.empty-email'));
      const options: ToastOptions = {
        message: message,
        duration: 1000,
        position: 'bottom',
        color: 'danger',
        cssClass: 'red-toast'
      };
      this.toast.create(options).then(toast => toast.present());
    }
  }
}