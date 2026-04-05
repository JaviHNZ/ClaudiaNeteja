import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registros.html',
  styleUrl: './registros.css',
})
export class Registros implements OnInit {
  fecha = '';
  horas = 0;

  casas: any[] = [];
casa_id: number | null = null;

  registros: any[] = [];
  editandoId: number | null = null;
  horasEdit = 0;

  busquedaCasa = '';
  resultadosCasas: any[] = [];

  mesActual = new Date().getMonth(); // 0-11
  anioActual = new Date().getFullYear();

 constructor(
  private api: ApiService,
  private cd: ChangeDetectorRef
) {}
  ngOnInit() {
    this.cargarCasas();
    this.cargarRegistros();
  }
  iniciarEdicion(r: any) {
    this.editandoId = r.id;
    this.horasEdit = r.horas;
  }
  // 🔥 CARGAR CASAS
  cargarCasas() {
    this.api.getCasas().subscribe({
      next: (res: any) => {
        this.casas = [...res];
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // 🔥 CARGAR REGISTROS
  cargarRegistros() {
    this.api.getRegistros().subscribe({
      next: (res: any) => {
        this.registros = [...res]; // 🔥 nueva referencia SIEMPRE
        this.cd.detectChanges(); // 🔥 fuerza actualización
      },
      error: (err) => console.error(err),
    });
  }

  // 🔥 AUTOCOMPLETAR HORAS
  onCasaChange() {
    const casa = this.casas.find((c) => c.id == this.casa_id);
    if (casa) {
      this.horas = casa.horas;
    }
  }

  // 🔥 GUARDAR
guardar() {
  if (!this.casa_id) return;

  this.api.crearRegistro({
    fecha: this.fecha,
    horas: this.horas,
    casa_id: this.casa_id
  }).subscribe({
    next: () => {
      this.cargarRegistros(); // 🔥 recarga real

      this.fecha = '';
      this.horas = 0;
      this.busquedaCasa = '';
      this.casa_id = null;
    }
  });
}

  // 🔥 NOMBRE CASA
  getCasaNombre(id: number) {
    if (!id) return '';

    const casa = this.casas.find((c) => c.id == id);
    return casa ? casa.nombre : '';
  }
  // 🔥 FORMATEAR FECHA
  formatearFecha(fecha: string) {
    const f = new Date(fecha);
    return f.toLocaleDateString();
  }
  guardarEdicion(id: number) {
    console.log('CLICK GUARDAR', id, this.horasEdit);

    this.api
      .editarRegistro(id, {
        horas: this.horasEdit,
      })
      .subscribe({
        next: (res: any) => {
          console.log('RESPUESTA:', res);

          this.registros = this.registros.map((r) =>
            r.id === id ? { ...r, horas: this.horasEdit } : r,
          );

          // salir del modo edición
          this.editandoId = null;
        },
        error: (err) => {
          console.error('ERROR:', err);
        },
      });
  }
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
  eliminar(id: number) {
    if (!confirm('¿Eliminar registro?')) return;

    this.api.eliminarRegistro(id).subscribe({
      next: () => {
        // actualizar frontend
        this.registros = this.registros.filter((r) => r.id !== id);
      },
      error: (err) => console.error(err),
    });
  }
  getTotalHorasMes() {
    return this.getRegistrosMes().reduce((total, r) => total + r.horas, 0);
  }
  getRegistrosMes() {
    return this.registros.filter((r) => {
      const fecha = new Date(r.fecha);

      return fecha.getMonth() === this.mesActual && fecha.getFullYear() === this.anioActual;
    });
  }

  // PROXIMAMENTE
  // getTotalDineroMes() {
  //   return this.getRegistrosMes().reduce((total, r) => {
  //     const casa = this.casas.find(c => c.id == r.casa_id);
  //     const precio = casa ? casa.precio : 0;

  //     return total + (r.horas * precio);
  //   }, 0);
  // }

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
  }

  getRegistrosAgrupadosPorDia() {
    const agrupado: any = {};

    this.getRegistrosMes().forEach((r) => {
      const fecha = r.fecha;

      if (!agrupado[fecha]) {
        agrupado[fecha] = {
          casas: [],
          horas: 0,
        };
      }

      const casaNombre = this.getCasaNombre(r.casa_id);

      agrupado[fecha].casas.push(casaNombre);
      agrupado[fecha].horas += r.horas;
    });

    return agrupado;
  }
  buscarCasa() {
    // 🔥 si el usuario escribe, resetear selección
    this.casa_id = 0;
    this.horas = 0;

    if (this.busquedaCasa.length < 2) {
      this.resultadosCasas = [];
      return;
    }

    this.api.buscarCasas(this.busquedaCasa).subscribe({
      next: (res: any) => {
        this.resultadosCasas = res;
      },
      error: (err) => console.error(err),
    });
  }
  seleccionarCasa(casa: any) {
    this.casa_id = casa.id;
    this.busquedaCasa = casa.nombre;
    this.horas = casa.horas;

    this.resultadosCasas = [];
  }

  generarPDF() {
    const doc = new jsPDF();

    const mes = this.mesActual + 1;
    const anio = this.anioActual;

    doc.setFontSize(14);
    doc.text(`Mes: ${mes}/${anio}`, 10, 10);

    let y = 20;

    const datos = this.getRegistrosAgrupadosPorDia();

    Object.keys(datos).forEach((fecha, index) => {
      const item = datos[fecha];

      const fechaFormateada = this.formatearFecha(fecha);
      const casas = item.casas.join(', ');
      const horas = item.horas;

      doc.text(`${index + 1}) ${fechaFormateada} - ${casas} - ${horas}h`, 10, y);

      y += 8;
    });

    y += 10;

    const total = this.getTotalHorasMes();

    doc.text(`===========================`, 10, y);
    y += 8;
    doc.text(`Total: ${total} horas`, 10, y);

    doc.save(`horas_${mes}_${anio}.pdf`);
  }
}
