import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl: string = 'http://localhost:9000/login';

  constructor(private http: HttpClient) { }

  ingresar(request: any): Observable<any> {
    return this.http.post(this.loginUrl, request, {
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<any>) => {
        const tokenHeader = response.headers.get('Authorization');
        const token = tokenHeader ? tokenHeader.replace('Bearer ', '') : null;

        if (token) {
          localStorage.setItem('token', token);
          console.log('✅ Token recibido y almacenado:', token); // <-- Aquí lo mostramos en consola
        } else {
          console.error('❌ Token no recibido');
        }

        return response.body;
      })
    );
  }
  registrar(data: any): Observable<any> {
    const url = 'http://localhost:9000/api/register'; // asegúrate de que coincida con tu backend
    return this.http.post(url, data);
  }


  // ✅ Este es el método que da el error si no está bien definido
  token(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
