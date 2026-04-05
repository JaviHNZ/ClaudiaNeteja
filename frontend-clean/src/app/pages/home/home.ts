import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  nombre = localStorage.getItem('nombre');
  rol = localStorage.getItem('rol');

  constructor(private router: Router) {}

  irRegistros() {
    this.router.navigate(['/registros']);
  }

  irAdmin() {
    this.router.navigate(['/admin']);
  }
}