import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRegisterInfo } from 'src/app/interfaces/user-register-info';
import { PasswordValidation } from 'src/app/validators/password';

/**
 * El componente RegisterFormComponent gestiona el formulario de registro de usuario.
 * Permite a los usuarios ingresar su información básica y contraseña para registrarse.
 * Emite un evento cuando se envía el formulario de registro.
 */
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {

  /**
   * Evento emitido cuando se envía el formulario de registro.
   * Emite un objeto de tipo UserRegisterInfo que contiene la información del usuario registrado.
   */
  @Output() onsubmit = new EventEmitter<UserRegisterInfo>();

  /**
   * FormGroup que contiene los campos y validaciones del formulario de registro.
   */
  form: FormGroup;

  constructor(
    private formB: FormBuilder
  ) { 
    // Inicialización del formulario utilizando FormBuilder para definir los campos y validaciones.
    this.form = formB.group({
      email: ['', [Validators.required]],         // Campo para el correo electrónico del usuario.
      name: ['', [Validators.required]],          // Campo para el nombre del usuario.
      surname: ['', [Validators.required]],       // Campo para el apellido del usuario.
      teamName: ['', [Validators.required]],      // Campo para el nombre del equipo del usuario.
      nation: ['', [Validators.required]],        // Campo para la nacionalidad del usuario.
      password: ['', [Validators.required, PasswordValidation.passwordProto('password')]],  // Campo para la contraseña del usuario.
      confirm: ['', [Validators.required, PasswordValidation.passwordProto('confirm')]]     // Campo para confirmar la contraseña del usuario.
    }, {
      validator: [PasswordValidation.passwordMatch('password', 'confirm')]  // Validador personalizado para asegurar que las contraseñas coincidan.
    });
  }

  ngOnInit() {}

  /**
   * Maneja el evento de envío del formulario.
   * Emite el evento `onsubmit` con el valor actual del formulario (UserRegisterInfo).
   */
  onSubmit() {
    this.onsubmit.emit(this.form.value);
  }
}