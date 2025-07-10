import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  menuItems = [
    {
      id: 'collapseSalon',
      label: 'Salon',
      icon: 'fa-solid fa-gift',
      expanded: false,
      children: [
        { label: 'Listado', link: '/salones' }
      ]
    },
    {
      id: 'collapseSalon',
      label: 'Profesor',
      icon: 'fa-solid fa-universal-access',
      expanded: false,
      children: [
        { label: 'Listado', link: '/profesores' }
      ]
    },
    {
      id: 'collapseAlumno',
      label: 'Alumnos',
      icon: 'fa-solid fa-plug',
      expanded: false,
      children: [
        { label: 'Listado', link: '/alumnos' }
      ]
    },
    {
      id: 'collapseCurso',
      label: 'Curso',
      icon: 'fa-solid fa-universal-access',
      expanded: false,
      children: [
        { label: 'Listado', link: '/cursos' }
      ]
    },
    {
      id: 'collapseInscripcion',
      label: 'Inscripcion',
      icon: 'fa-solid fa-universal-access',
      expanded: false,
      children: [
        { label: 'Listado', link: '/inscripciones' }
      ]
    }
  ];

  sidebarVisible = true;

  constructor(private router: Router) { }

  logout() {
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;

    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  }
}
