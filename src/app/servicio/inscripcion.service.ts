import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private baseUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) { }

  // Utilidad para incluir el token en cada solicitud
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // === ALUMNO ===

  listaInscripciones(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/inscripcion/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  crearInscripcion(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/inscripcion/crear`, request, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerInscripcionPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/inscripcion/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  editarInscripcion(id: number, request: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/inscripcion/editar/${id}`, request, {
      headers: this.getAuthHeaders()
    });
  }

  // === COMBOS (todos requieren token) ===

  obtenerAlumnos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/alumno/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerCursos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/curso/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerSalones(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/salon/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerEstados(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/estado/lista`, {
      headers: this.getAuthHeaders()
    });
  }

}
