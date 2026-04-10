import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {
  trabajadores: any[] = [];

  constructor(
  private api: ApiService,
  private router: Router,
  private cd: ChangeDetectorRef
) {}
ngOnInit() {
  if (localStorage.getItem('rol') !== 'admin') {
    this.router.navigate(['/registros']);
    return;
  }

 this.api.getResumenTrabajadores().subscribe({
  next: (res: any) => {
    this.trabajadores = res;

    this.cd.detectChanges(); // 🔥 FIX
  },
  error: (err) => console.error(err),
});
}
verDetalle(trabajador: any) {
  this.router.navigate(['/admin/usuario', trabajador.id]);
}
formatearHoras(h: number) {
  const horas = Math.floor(h);
  const minutos = Math.round((h - horas) * 60);

  return `${horas}h ${minutos}min`;
}
}
