import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private baseUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) { }

  // Utilidad para incluir el token en cada solicitud
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // === ALUMNO ===

  listaAlumnos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/alumno/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  crearAlumno(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/alumno/crear`, request, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerAlumnoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/alumno/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  editarAlumno(id: number, request: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/alumno/editar/${id}`, request, {
      headers: this.getAuthHeaders()
    });
  }

  // === COMBOS (todos requieren token) ===

  obtenerGeneros(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/genero/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerPaises(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pais/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerDistritos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/distrito/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerEstados(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/estado/lista`, {
      headers: this.getAuthHeaders()
    });
  }

}
