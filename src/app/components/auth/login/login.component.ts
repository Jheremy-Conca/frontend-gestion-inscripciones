import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../../../servicio/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  formRegistro: FormGroup;
  verPasswordLogin: boolean = false;
  verPasswordRegistro: boolean = false;
  verConfirmPassword: boolean = false;

  mensajeError: string = '';
  mensajeExito: string = '';

  modo: 'login' | 'registro' = 'login';

  constructor(
    private fb: FormBuilder,
    private _loginService: LoginService,
    private router: Router
  ) {
    // Formulario de Login
    this.formLogin = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });

    // Formulario de Registro
    this.formRegistro = this.fb.group({
      nombre: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      rol: ['Admin', Validators.required]
    });
  }

  ngOnInit(): void { }

  // LOGIN
  login(): void {
    this.resetMensajes();

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      this.mensajeError = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    this._loginService.ingresar(this.formLogin.value).subscribe({
      next: (res) => {
        this.mensajeError = '';
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          showConfirmButton: false,
          timer: 1500
        });

        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error de autenticación:', err);
        this.alertaError('Credenciales inválidas');
      }
    });
  }

  // REGISTRO
  registrar(): void {
    this.resetMensajes();

    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      this.mensajeError = 'Completa todos los campos.';
      return;
    }

    const { password, confirmPassword } = this.formRegistro.value;
    if (password !== confirmPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    const nuevoUsuario = {
      nombre: this.formRegistro.value.nombre,
      email: this.formRegistro.value.email,
      password: this.formRegistro.value.password,
      rol: this.formRegistro.value.rol
    };

    this._loginService.registrar(nuevoUsuario).subscribe({
      next: () => {
        this.mensajeExito = '✅ Registro exitoso. Ahora puedes iniciar sesión.';
        this.mensajeError = '';
        this.formRegistro.reset({ rol: 'Admin' });

        // Esperar 2.5s antes de volver al login
        setTimeout(() => {
          this.mensajeExito = '';
          this.modo = 'login';
        }, 2500);
      },
      error: () => {
        this.mensajeExito = '';
        this.mensajeError = 'No se pudo registrar el usuario.';
      }
    });
  }

  alertaError(mensaje: string): void {
    this.mensajeError = mensaje;
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: mensaje,
      showConfirmButton: false,
      timer: 1500
    });
    this.formLogin.reset();
  }

  // Limpiar mensajes al cambiar de formulario
  cambiarModo(nuevoModo: 'login' | 'registro'): void {
    this.modo = nuevoModo;
    this.resetMensajes();
  }
  togglePasswordLogin(): void {
    this.verPasswordLogin = !this.verPasswordLogin;
  }

  togglePasswordRegistro(): void {
    this.verPasswordRegistro = !this.verPasswordRegistro;
  }

  toggleConfirmPassword(): void {
    this.verConfirmPassword = !this.verConfirmPassword;
  }

  // Limpia mensajes
  private resetMensajes(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
  }
}
