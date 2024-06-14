import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

export const PICTURE_SELECTABLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PictureSelectableComponent),
  multi: true
};

/**
 * El componente PictureSelectableComponent permite al usuario seleccionar, tomar y eliminar imágenes.
 * Implementa ControlValueAccessor para integrarse con formularios reactivos.
 */
@Component({
  selector: 'app-picture-selectable',
  templateUrl: './picture-selectable.component.html',
  styleUrls: ['./picture-selectable.component.scss'],
  providers: [PICTURE_SELECTABLE_VALUE_ACCESSOR]
})
export class PictureSelectableComponent implements OnInit, ControlValueAccessor, OnDestroy {

  /**
   * BehaviorSubject para gestionar el estado de la imagen.
   */
  private _picture = new BehaviorSubject("");

  /**
   * Observable de la imagen seleccionada.
   */
  public picture$ = this._picture.asObservable();

  /**
   * Indica si el componente está deshabilitado.
   */
  isDisabled: boolean = false;

  /**
   * Indica si hay una imagen seleccionada.
   */
  hasValue: boolean = false;

  /**
   * Indica si el modal está abierto.
   */
  isModalOpen: boolean = false;

  constructor(private pictureModal: ModalController) { }

  ngOnDestroy(): void {
    this._picture.complete();
  }

  ngOnInit() {}

  propagateChange = (obj: any) => {}

  /**
   * Escribe el valor en el componente.
   * @param obj - El valor a escribir.
   */
  writeValue(obj: any): void {
    if (obj) {
      this.hasValue = true;
      this._picture.next(obj);
    }
  }

  /**
   * Registra una función que se llamará cuando el valor cambie.
   * @param fn - La función de callback.
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * Registra una función que se llamará cuando el componente sea tocado.
   * @param fn - La función de callback.
   */
  registerOnTouched(fn: any): void {}

  /**
   * Habilita o deshabilita el componente.
   * @param isDisabled - Indica si el componente está deshabilitado.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Cambia la imagen seleccionada.
   * @param picture - La nueva imagen.
   */
  changePicture(picture: string) {
    this.hasValue = picture != '';
    this._picture.next(picture);
    this.propagateChange(picture);
  }

  /**
   * Maneja el evento de cambio de imagen desde un input de archivo.
   * @param event - El evento de cambio.
   * @param fileLoader - El input de archivo.
   */
  onChangePicture(event: Event, fileLoader: HTMLInputElement) {
    event.stopPropagation();
    fileLoader.onchange = () => {
      if (fileLoader.files && fileLoader.files.length > 0) {
        var file = fileLoader.files[0];
        var reader = new FileReader();
        reader.onload = () => {
          this.changePicture(reader.result as string);
          this.setOpen(false);
        };
        reader.onerror = (error) => {
          console.log(error);
        };
        reader.readAsDataURL(file);
      }
    };
    fileLoader.click();
  }

  /**
   * Maneja el evento de eliminar imagen.
   * @param event - El evento de clic.
   */
  onDeletePicture(event: Event) {
    event.stopPropagation();
    this.changePicture('');
  }

  /**
   * Abre la cámara para tomar una nueva imagen.
   * @param event - El evento de clic.
   */
  async takePicture(event: Event) {
    event.stopPropagation();
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.changePicture(image.webPath!!);
    this.setOpen(false);
  }

  /**
   * Abre o cierra el modal.
   * @param isOpen - Indica si el modal debe estar abierto.
   */
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  /**
   * Cierra el modal.
   */
  close() {
    this.pictureModal?.dismiss();
  }
}