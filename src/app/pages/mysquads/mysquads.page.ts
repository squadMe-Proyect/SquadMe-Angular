import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { SquadFormComponent } from 'src/app/components/squad-components/squad-form/squad-form.component';
import { Squad } from 'src/app/interfaces/squad';
import { AuthService } from 'src/app/services/api/auth.service';
import { CustomTranslateService } from 'src/app/services/auxiliar/custom-translate.service';
import { MatchService } from 'src/app/services/model/match.service';
import { SquadService } from 'src/app/services/model/squad.service';

/**
 * Página para gestionar escuadras (equipos).
 * Permite ver, filtrar, editar y eliminar escuadras.
 */
@Component({
  selector: 'app-mysquads',
  templateUrl: './mysquads.page.html',
  styleUrls: ['./mysquads.page.scss'],
})
export class MySquadsPage implements OnInit {

  coachId: string | undefined; // Identificador del entrenador
  squads: Squad[] = []; // Lista de escuadras
  private user: any; // Usuario actual
  loading: boolean = false; // Indicador de carga

  /**
   * Constructor de MySquadsPage.
   * @param squadsSvc Servicio de gestión de escuadras (`SquadService`).
   * @param modal Controlador de modales (`ModalController`).
   * @param authSvc Servicio de autenticación (`AuthService`).
   * @param matchSvc Servicio de gestión de partidos (`MatchService`).
   * @param toast Controlador de toasts (`ToastController`).
   * @param translate Servicio para traducciones personalizadas (`CustomTranslateService`).
   */
  constructor(
    public squadsSvc: SquadService,
    private modal: ModalController,
    public authSvc: AuthService,
    public matchSvc: MatchService,
    private toast: ToastController,
    public translate: CustomTranslateService
  ) {
    this.loading = true;
    // Suscripción al usuario actual
    this.authSvc.user$.subscribe(u => {
      this.user = u;
      this.onLoadSquads(u); // Cargar las escuadras del usuario
      if (this.user.role == 'ADMIN') {
        this.coachId = this.user.id; // Si es administrador, usar su propio ID como coachId
      } else {
        this.coachId = this.user.coachId; // Si es entrenador, usar el coachId asignado
      }
    });
  }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializarse el componente.
   */
  ngOnInit() {}

  /**
   * Carga las escuadras del usuario actual.
   * @param user Usuario actual.
   */
  onLoadSquads(user: any) {
    this.loading = false;
    this.squadsSvc.squads$.subscribe(_squads => {
      const sqs = [..._squads];
      // Filtrar las escuadras por el coachId del usuario actual
      this.squads = sqs.filter(s => s.coachId == user.id || s.coachId == user.coachId);
      console.log(this.squads); // Imprimir las escuadras cargadas (para propósitos de depuración)
    });
  }

  /**
   * Presenta un formulario para agregar o editar una escuadra.
   * @param data Datos de la escuadra para editar o `null` para agregar una nueva.
   * @param onDismiss Función a ejecutar cuando se cierra el modal.
   */
  async presentForm(data: Squad | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: SquadFormComponent,
      componentProps: {
        squad: data,
        coachId: this.coachId
      },
      cssClass: 'squad-modal'
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result?.data) {
        onDismiss(result);
      }
    });
  }

  /**
   * Agrega una nueva escuadra.
   */
  onNewSquad() {
    var onDismiss = (info: any) => {
      this.loading = true;
      // Agregar la escuadra usando el servicio de gestión de escuadras
      this.squadsSvc.addSquad(info.data, this.user).subscribe(_ => {
        this.onLoadSquads(this.user); // Recargar las escuadras después de agregar
      });
    };
    this.presentForm(null, onDismiss); // Presentar formulario para agregar una nueva escuadra
  }

  /**
   * Edita una escuadra existente.
   * @param squad Escuadra a editar.
   */
  onEditSquad(squad: Squad) {
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'ok': {
          this.loading = true;
          squad = info.data; // Actualizar los datos de la escuadra con la información editada
          // Actualizar la escuadra usando el servicio de gestión de escuadras
          this.squadsSvc.updateSquad(squad, this.user).subscribe(_ => {
            this.onLoadSquads(this.user); // Recargar las escuadras después de la actualización
          });
          this.matchSvc.updateSquadOnMatch(squad, this.user).subscribe(); // Actualizar escuadra en los partidos relacionados
        }
        break;
        case 'cancel': {
          this.loading = true;
          // Obtener nuevamente los datos de la escuadra desde el servicio si se cancela la edición
          this.squadsSvc.getSquad(squad.id!).subscribe(_ => {
            this.onLoadSquads(this.user); // Recargar las escuadras después de obtener nuevamente
          });
        }
      }
    };
    this.presentForm(squad, onDismiss); // Presentar formulario para editar la escuadra
  }

  /**
   * Elimina una escuadra.
   * @param squad Escuadra a eliminar.
   */
  onDeleteSquad(squad: Squad) {
    this.loading = true;
    // Eliminar la escuadra usando el servicio de gestión de escuadras
    this.squadsSvc.deleteSquad(squad, this.user).subscribe({
      next: (_: any) => {}, // Manejar el resultado exitoso si se requiere
      error: async (err: any) => {
        // Manejar el error al intentar eliminar la escuadra
        const message = await lastValueFrom(this.translate.get('squad.squadInMatch'));
        const options: ToastOptions = {
          message: message,
          duration: 1000,
          position: 'bottom',
          color: 'danger',
          cssClass: 'red-toast'
        };
        this.toast.create(options).then(toast => toast.present()); // Mostrar mensaje de error como un toast
        console.error(err); // Imprimir el error en la consola para propósitos de depuración
      }
    });
    this.onLoadSquads(this.user); // Recargar las escuadras después de eliminar
  }
}