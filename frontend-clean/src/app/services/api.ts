import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // 🔥 CAMBIA SOLO AQUÍ
  private API = 'https://claudianeteja.onrender.com';

  constructor(private http: HttpClient) {}

  // 🔐 TOKEN
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // 🔑 AUTH
  login(data: any) {
    return this.http.post(`${this.API}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.API}/auth/register`, data);
  }

  // 🧾 REGISTROS
  crearRegistro(data: any) {
    return this.http.post(`${this.API}/registros`, data, this.getHeaders());
  }

  getRegistros() {
    return this.http.get(`${this.API}/registros`, this.getHeaders());
  }

  editarRegistro(id: number, data: any) {
    return this.http.put(`${this.API}/registros/${id}`, data, this.getHeaders());
  }

  eliminarRegistro(id: number) {
    return this.http.delete(`${this.API}/registros/${id}`, this.getHeaders());
  }

  // 🏠 CASAS
  getCasas() {
    return this.http.get(`${this.API}/registros/casas`, this.getHeaders());
  }

  buscarCasas(query: string) {
    return this.http.get(`${this.API}/registros/casas/buscar?q=${query}`, this.getHeaders());
  }

  // 👑 ADMIN
  getResumenTrabajadores() {
    return this.http.get(`${this.API}/registros/admin/resumen`, this.getHeaders());
  }

  getRegistrosPorUsuario(id: number) {
    return this.http.get(`${this.API}/registros/admin/usuario/${id}`, this.getHeaders());
  }
}
