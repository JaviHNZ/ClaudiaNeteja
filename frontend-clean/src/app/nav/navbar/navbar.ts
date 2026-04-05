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

    // 🔥 escuchar cambios de ruta (FIX del bug)
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
    this.router.navigate(['/login']);
  }
}