import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  nombre = '';
  email = '';
  password = '';
  mensaje = '';

  constructor(private api: ApiService) {}

  register() {
    this.api.register({
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.mensaje = "Usuario creado ✅";
      },
      error: (err) => {
        this.mensaje = err.error.message || "Error ❌";
      }
    });
  }
}