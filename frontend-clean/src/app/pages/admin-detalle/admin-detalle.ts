import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-admin-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-detalle.html',
  styleUrls: ['./admin-detalle.css'],
})
export class AdminDetalle implements OnInit {
  registros: any[] = [];
  registrosFiltrados: any[] = [];

  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();

  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      this.cargarRegistros();
    });
  }

  // 🔥 cargar registros
  cargarRegistros() {
    this.api.getRegistrosPorUsuario(this.id).subscribe({
      next: (res: any) => {
        this.registros = res.sort((a: any, b: any) => {
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        });
        this.actualizarFiltrado();

        // 🔥 FORZAR ACTUALIZACIÓN (ESTA ES LA CLAVE)
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // 🔥 filtrar por mes
  actualizarFiltrado() {
    this.registrosFiltrados = this.registros.filter((r) => {
      const fecha = new Date(r.fecha);

      return fecha.getMonth() === this.mesActual && fecha.getFullYear() === this.anioActual;
    });
  }

  // 🔥 total (usar filtrados)
  getTotalMes() {
    return this.registrosFiltrados.reduce((t, r) => t + Number(r.horas), 0);
  }

  // 🔥 cambiar mes
  cambiarMes(valor: number) {
    this.mesActual += valor;

    if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }

    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    }

    this.actualizarFiltrado();
  }

  // 🔥 formato fecha
  formatearFecha(fecha: string) {
    const f = new Date(fecha);
    return f.toLocaleDateString('es-ES');
  }

  // 🔥 nombre mes
  getNombreMes() {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    return meses[this.mesActual];
  }
  formatearHoras(h: number) {
    const horas = Math.floor(h);
    const minutos = Math.round((h - horas) * 60);

    return `${horas}h ${minutos}min`;
  }
}
