import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private baseUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) { }

  // Utilidad para incluir el token en cada solicitud
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // === ALUMNO ===

  listaProfesores(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profesor/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  crearProfesor(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/profesor/crear`, request, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerProfesorPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profesor/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  editarProfesor(id: number, request: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/profesor/editar/${id}`, request, {
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
