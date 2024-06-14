import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/interfaces/user-credentials';

/**
 * El componente LoginFormComponent es responsable de gestionar el formulario de inicio de sesión.
 * Permite el inicio de sesión con credenciales y el inicio de sesión anónimo.
 */
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {

  /**
   * El formulario reactivo utilizado para gestionar el inicio de sesión.
   */
  form: FormGroup | null = null;

  /**
   * Establece el valor del campo de correo electrónico en el formulario.
   * @param value - El valor del correo electrónico.
   */
  @Input('email') set email(value: string) {
    this.form?.controls['email'].setValue(value);
  }

  /**
   * @Output onsubmit - Evento emitido cuando se envía el formulario de inicio de sesión con credenciales.
   */
  @Output() onsubmit = new EventEmitter<UserCredentials>();

  /**
   * @Output onsubmitAnonymously - Evento emitido cuando se envía el formulario de inicio de sesión anónimo.
   */
  @Output() onsubmitAnonymously = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  /**
   * Método llamado al enviar el formulario de inicio de sesión.
   * Emite el evento onsubmit con las credenciales del usuario.
   */
  onSubmit() {
    this.onsubmit.emit(this.form?.value);
    this.form?.controls['password'].setValue('');
  }

  /**
   * Método llamado al enviar el formulario de inicio de sesión anónimo.
   * Emite el evento onsubmitAnonymously.
   */
  onSubmitAnonymously() {
    this.onsubmitAnonymously.emit();
  }
}