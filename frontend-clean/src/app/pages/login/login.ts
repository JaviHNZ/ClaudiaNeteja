import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  login() {
    this.api
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);

          // 🔐 guardar datos
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.user.rol);
          localStorage.setItem('nombre', res.user.nombre);

          // 🔥 redirección según rol
          // if (res.user.rol === 'admin') {
          //   this.router.navigate(['/admin']);
          // } else {
          //   this.router.navigate(['/registros']);
          // }
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error(err);
          alert('Error login ❌');
        },
      });
  }
}
