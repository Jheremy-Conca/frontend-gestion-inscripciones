import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalonService {

  private baseUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) { }

  // Utilidad para incluir el token en cada solicitud
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // === ALUMNO ===

  listaSalones(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/salon/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  crearSalon(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/salon/crear`, request, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerSalonPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/salon/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  editarSalon(id: number, request: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/salon/editar/${id}`, request, {
      headers: this.getAuthHeaders()
    });
  }

  // === COMBOS (todos requieren token) ===



  obtenerTipoSalon(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tipossalon/lista`, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerEstados(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/estado/lista`, {
      headers: this.getAuthHeaders()
    });
  }

}
