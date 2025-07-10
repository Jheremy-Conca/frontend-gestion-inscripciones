import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private baseUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) { }

  // Utilidad para incluir el token en cada solicitud
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // === ALUMNO ===

  listaCursos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/curso/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  crearCurso(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/curso/crear`, request, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerCursoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/curso/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  editarCurso(id: number, request: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/curso/editar/${id}`, request, {
      headers: this.getAuthHeaders()
    });
  }

  // === COMBOS (todos requieren token) ===

  obtenerProfesores(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profesor/lista`, {
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
