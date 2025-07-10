import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SalonesComponent } from './components/salon/salon.component';

import { AuthGuard } from './components/helpers/auth.guard';
import { AuthInterceptor } from './components/helpers/auth.interceptor';
import { ProfesoresComponent } from './components/profesores/profesores.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { InscripcionesComponent } from './components/inscripciones/inscripciones.component';

@NgModule({
  declarations: [
    AppComponent,
    AlumnosComponent,
    LoginComponent,
    HomeComponent,
    SalonesComponent,
    ProfesoresComponent,
    CursosComponent,
    InscripcionesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'alumnos', component: AlumnosComponent, canActivate: [AuthGuard] },
      { path: 'salones', component: SalonesComponent, canActivate: [AuthGuard] },
      { path: 'profesores', component: ProfesoresComponent, canActivate: [AuthGuard] },
      { path: 'inscripciones', component: InscripcionesComponent, canActivate: [AuthGuard] },
      { path: 'cursos', component: CursosComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' }
    ])
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
