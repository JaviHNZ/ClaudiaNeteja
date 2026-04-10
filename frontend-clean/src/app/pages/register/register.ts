import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  nombre = '';
  email = '';
  password = '';
  mensaje = '';

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}
  register() {
    this.api
      .register({
        nombre: this.nombre,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res: any) => {
          this.mensaje = 'Usuario creado ✅';

          // 🔥 LOGIN AUTOMÁTICO
          this.api
            .login({
              email: this.email,
              password: this.password,
            })
            .subscribe({
              next: (loginRes: any) => {
                // 🔐 guardar token
                localStorage.setItem('token', loginRes.token);

                // 🚀 redirigir
                this.router.navigate(['/home']);
              },
              error: () => {
                this.mensaje = 'Usuario creado, pero error al iniciar sesión ❌';
              },
            });
        },
        error: (err) => {
          this.mensaje = err.error.message || 'Error ❌';
        },
      });
  }
}
