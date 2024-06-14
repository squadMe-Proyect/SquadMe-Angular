import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Coach } from 'src/app/interfaces/coach';
import { Player } from 'src/app/interfaces/player';
import { AuthService } from 'src/app/services/api/auth.service';
import { MediaService } from 'src/app/services/api/media.service';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';
import { CoachService } from 'src/app/services/model/coach.service';
import { PlayerService } from 'src/app/services/model/player.service';

/**
 * Página para la gestión del perfil de usuario (jugador o entrenador).
 */
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  form: FormGroup; // Formulario para la edición de datos del usuario
  user: Player | Coach | null = null; // Usuario actual (puede ser jugador o entrenador)
  openModal: boolean = false; // Indicador para abrir o cerrar el modal de edición

  /**
   * Constructor de la página UserPage.
   * @param authSvc Servicio de autenticación para obtener información del usuario.
   * @param formB Constructor de formularios reactivos para crear el formulario de edición.
   * @param coachSvc Servicio de gestión de entrenadores.
   * @param playerSvc Servicio de gestión de jugadores.
   * @param mediaSvc Servicio para la gestión de medios (imágenes).
   * @param toast Controlador de mensajes Toast para mostrar notificaciones al usuario.
   * @param translate Servicio de traducción personalizada para obtener mensajes localizados.
   */
  constructor(
    public authSvc: AuthService,
    private formB: FormBuilder,
    public coachSvc: CoachService,
    public playerSvc: PlayerService,
    public mediaSvc: MediaService,
    private toast: ToastController,
    public translate: CustomTranslateService
  ) {
    // Suscripción al observable de usuario para actualizar los datos cuando cambia
    this.authSvc.user$.subscribe(u => {
      this.user = u; // Asigna el usuario actual
    });

    this.form = this.formB.group({}); // Inicializa el formulario vacío al inicio
  }

  /**
   * Método de ciclo de vida de Angular, se ejecuta al inicializarse el componente.
   */
  ngOnInit() {}

  /**
   * Convierte una URL de datos en formato base64 a un objeto Blob.
   * @param dataUrl URL de datos en formato base64.
   * @param callback Función de devolución que recibe el objeto Blob resultante.
   */
  private dataURLtoBlob(dataUrl: string, callback: (blob: Blob) => void) {
    var req = new XMLHttpRequest();
    req.open('GET', dataUrl);
    req.responseType = 'arraybuffer';

    req.onload = function fileLoaded(e) {
      var mime = this.getResponseHeader('content-type');
      callback(new Blob([this.response], { type: mime || undefined }));
    };

    req.send();
  }

  /**
   * Configura el formulario con los datos del usuario para abrir el modal de edición.
   * @param open Estado para abrir o cerrar el modal de edición.
   */
  setOpen(open: boolean) {
    this.form = this.formB.group({
      id: [this.user?.id],
      name: [this.user?.name, [Validators.required]],
      surname: [this.user?.surname, [Validators.required]],
      nation: [this.user?.nation, [Validators.required]],
      picture: [this.user?.picture]
    });
    this.openModal = open; // Establece el estado del modal
  }

  /**
   * Maneja el evento de envío del formulario de edición del usuario.
   * @param modal Modal activo que contiene el formulario de edición.
   */
  async onSubmit(modal: IonModal) {
    const previousTeam = this.user?.teamName;

    // Construye el objeto actualizado con los datos del formulario
    var updatedCoach = {
      id: this.form.controls['id'].value,
      name: this.form.controls['name'].value,
      surname: this.form.controls['surname'].value,
      teamName: this.user?.teamName!!,
      nation: this.form.controls['nation'].value,
      picture: this.form.controls['picture'].value,
      role: this.user?.role!!,
      email: this.user?.email!!
    };

    // Si no se seleccionó una imagen nueva
    if (updatedCoach.picture == null) {
      updatedCoach.picture = ""; // Establece la imagen como cadena vacía
      this.authSvc.setUser(updatedCoach).subscribe(); // Actualiza los datos del usuario
      this.coachSvc.updateCoach(this.form.value).subscribe(); // Actualiza el perfil del entrenador
      modal.dismiss(); // Cierra el modal
    } else {
      // Si la imagen es una URL de datos (base64)
      if (updatedCoach.picture.substring(0, 4) == "data") {
        // Convierte la URL de datos a un objeto Blob
        this.dataURLtoBlob(updatedCoach.picture, (blob: Blob) => {
          // Sube el blob de la imagen al servicio de medios
          this.mediaSvc.upload(blob).subscribe((media: any) => {
            updatedCoach.picture = media.file; // Asigna la URL de la imagen subida
            this.authSvc.setUser(updatedCoach).subscribe(); // Actualiza los datos del usuario
            this.coachSvc.updateCoach(updatedCoach).subscribe(); // Actualiza el perfil del entrenador
            modal.dismiss(); // Cierra el modal
          });
        });
      } else {
        // Si la imagen es una URL directa o está vacía
        this.authSvc.setUser(updatedCoach).subscribe(); // Actualiza los datos del usuario
        this.coachSvc.updateCoach(updatedCoach).subscribe(); // Actualiza el perfil del entrenador
        modal.dismiss(); // Cierra el modal
      }
    }
  }

  /**
   * Reinicia la contraseña del usuario actual.
   * Muestra un mensaje Toast con el resultado de la operación.
   */
  resetPassword() {
    this.authSvc.resetPassword().subscribe(async _ => {
      const message = await lastValueFrom(this.translate.get('user-card.password-message'));
      const options: ToastOptions = {
        message: message,
        duration: 1000,
        position: 'bottom',
        color: 'tertiary',
        cssClass: 'red-toast'
      };
      this.toast.create(options).then(toast => toast.present()); // Muestra el mensaje Toast
    });
  }

  /**
   * Cancela la edición del perfil de usuario.
   * @param modal Modal activo que se va a cerrar.
   */
  onCancel(modal: IonModal) {
    modal.dismiss(); // Cierra el modal
  }
}
