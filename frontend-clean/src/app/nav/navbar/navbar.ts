import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  nombre: string | null = '';
  rol: string | null = '';

  constructor(private router: Router) {}

ngOnInit() {
  this.cargarUsuario();

  const tema = localStorage.getItem('tema') || 'light';

  // 🔥 aplicar tema correctamente
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(tema);

  this.router.events.subscribe(() => {
    this.cargarUsuario();
  });
}
  cargarUsuario() {
    this.nombre = localStorage.getItem('nombre');
    this.rol = localStorage.getItem('rol');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
  isLogged(): boolean {
  return !!localStorage.getItem('token');
}
toggleTema() {
  const actual = localStorage.getItem('tema') || 'light';
  const nuevo = actual === 'light' ? 'dark' : 'light';

  localStorage.setItem('tema', nuevo);
  document.body.className = nuevo;
}
}