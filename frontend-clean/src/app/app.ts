import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './nav/navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule, // 🔥 ESTO FALTABA
    RouterOutlet,
    Navbar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend-clean');
  currentUrl = '';

constructor(private router: Router) {}

ngOnInit() {
  this.currentUrl = this.router.url;

  this.router.events.subscribe(() => {
    this.currentUrl = this.router.url;
  });
}
}
