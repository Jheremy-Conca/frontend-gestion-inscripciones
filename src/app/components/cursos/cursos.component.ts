import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CursoService } from '../../servicio/curso.service';

declare var bootstrap: any;

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  listaCursos: any[] = [];
  listaProfesores: any[] = [];
  listaSalones: any[] = [];
  listaEstados: any[] = [];

  formCurso!: FormGroup;
  title = '';
  nameBoton = '';
  idSeleccionado!: number;

  sidebarVisible = true;

  constructor(
    private cursoService: CursoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.obtenerCursos();
    this.cargarCombos();
  }

  initForm(): void {
    this.formCurso = new FormGroup({
      nombreCurso: new FormControl('', Validators.required),
      vacantes: new FormControl('', [Validators.required, Validators.min(1)]),
      idProfesor: new FormControl('', Validators.required),
      idSalon: new FormControl('', Validators.required),
      idEstado: new FormControl('', Validators.required)
    });
  }

  obtenerCursos(): void {
    this.cursoService.listaCursos().subscribe({
      next: (data) => {
        this.listaCursos = data.cursos;
      },
      error: (err) => console.error('Error al cargar cursos:', err)
    });
  }

  prepararFormulario(): any {
    const form = this.formCurso.value;
    return {
      nombreCurso: form.nombreCurso,
      vacantes: form.vacantes,
      profesor: { idProfesor: form.idProfesor },
      salon: { idSalon: form.idSalon },
      estado: { idEstado: form.idEstado }
    };
  }

  registrarCurso(): void {
    const datos = this.prepararFormulario();
    this.cursoService.crearCurso(datos).subscribe({
      next: () => {
        this.alertaExitosa('registrado');
        this.cerrarModal();
        this.obtenerCursos();
        this.resetForm();
      },
      error: (err) => console.error('Error al registrar curso:', err)
    });
  }

  editarCurso(): void {
    const datos = this.prepararFormulario();
    this.cursoService.editarCurso(this.idSeleccionado, datos).subscribe({
      next: () => {
        this.alertaExitosa('modificado');
        this.cerrarModal();
        this.obtenerCursos();
        this.resetForm();
      },
      error: (err) => console.error('Error al modificar curso:', err)
    });
  }

  obtenerCursoPorId(id: number): void {
    this.cursoService.obtenerCursoPorId(id).subscribe({
      next: (data) => {
        const curso = data.curso;
        this.formCurso.setValue({
          nombreCurso: curso.nombreCurso,
          vacantes: curso.vacantes,
          idProfesor: curso.profesor?.idProfesor || '',
          idSalon: curso.salon?.idSalon || '',
          idEstado: curso.estado?.idEstado || ''
        });
      },
      error: (err) => console.error('Error al obtener curso:', err)
    });
  }

  titulo(accion: string, id?: number): void {
    this.title = `${accion} curso`;
    this.nameBoton = accion === 'Crear' ? 'Guardar' : 'Modificar';

    if (accion === 'Editar' && id != null) {
      this.idSeleccionado = id;
      this.obtenerCursoPorId(id);
      this.mostrarModal();
    } else {
      this.resetForm();
      this.mostrarModal();
    }
  }

  crearCurso(): void {
    if (this.formCurso.invalid) {
      Swal.fire('Formulario incompleto', 'Completa todos los campos', 'warning');
      return;
    }

    const mensaje = this.nameBoton === 'Guardar' ? 'registrar' : 'modificar';
    Swal.fire({
      title: `¿Estás seguro de ${mensaje} el curso?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${mensaje}`,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.nameBoton === 'Guardar' ? this.registrarCurso() : this.editarCurso();
      }
    });
  }

  alertaExitosa(mensaje: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `Curso ${mensaje} correctamente`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('modalCurso');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open');
        }, 500);
      }
    }
  }

  resetForm(): void {
    this.formCurso.reset();
    this.formCurso.markAsPristine();
    this.formCurso.markAsUntouched();
  }

  cerrarBoton(): void {
    this.resetForm();
    this.cerrarModal();
  }

  mostrarModal(): void {
    const modalElement = document.getElementById('modalCurso');
    if (modalElement) {
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
      }
      modalInstance.show();
    }
  }

  cargarCombos(): void {
    this.cursoService.obtenerProfesores().subscribe({
      next: (data) => this.listaProfesores = data.profesores,
      error: (err) => console.error('Error al cargar profesores:', err)
    });

    this.cursoService.obtenerSalones().subscribe({
      next: (data) => this.listaSalones = data.salones,
      error: (err) => console.error('Error al cargar salones:', err)
    });

    this.cursoService.obtenerEstados().subscribe({
      next: (data) => this.listaEstados = data.estados,
      error: (err) => console.error('Error al cargar estados:', err)
    });
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  }

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
      id: 'collapseProfesor',
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
}
