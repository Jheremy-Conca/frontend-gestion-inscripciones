import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ProfesorService } from '../../servicio/profesores.service';
import { LoginService } from '../../servicio/login.service';

declare var bootstrap: any;

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit {

  listaProfesores: any[] = [];
  listaGeneros: any[] = [];
  listaPaises: any[] = [];
  listaDistritos: any[] = [];
  listaEstados: any[] = [];

  formProfesor!: FormGroup;
  title = '';
  nameBoton = '';
  idSeleccionado!: number;

  filtroNombre: string = '';
  listaProfesoresOriginal: any[] = [];

  sidebarVisible = true;

  constructor(
    private profesorService: ProfesorService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.obtenerProfesores();
    this.cargarCombos();
  }

  initForm(): void {
    this.formProfesor = new FormGroup({
      nombres: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      dni: new FormControl('', [Validators.required, Validators.minLength(8)]),
      telefono: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      idGenero: new FormControl('', Validators.required),
      idPais: new FormControl('', Validators.required),
      idDistrito: new FormControl('', Validators.required),
      idEstado: new FormControl('', Validators.required)
    });
  }

  obtenerProfesores(): void {
    this.profesorService.listaProfesores().subscribe({
      next: (data) => {
        this.listaProfesoresOriginal = data.profesores;
        this.listaProfesores = [...this.listaProfesoresOriginal];
      },
      error: (err) => console.error('Error al cargar profesores:', err)
    });
  }

  filtrarProfesores(): void {
    const filtro = this.filtroNombre.toLowerCase();
    this.listaProfesores = this.listaProfesoresOriginal.filter(p =>
      p.nombres.toLowerCase().includes(filtro) ||
      p.apellidos.toLowerCase().includes(filtro) ||
      p.dni.includes(filtro)
    );
  }

  prepararFormulario(): any {
    const form = this.formProfesor.value;
    return {
      nombres: form.nombres,
      apellidos: form.apellidos,
      dni: form.dni,
      telefono: form.telefono,
      correo: form.correo,
      genero: { idGenero: form.idGenero },
      pais: { idPais: form.idPais },
      distrito: { idDistrito: form.idDistrito },
      estado: { idEstado: form.idEstado }
    };
  }

  registrarProfesor(): void {
    const datos = this.prepararFormulario();
    this.profesorService.crearProfesor(datos).subscribe({
      next: () => {
        this.alertaExitosa('registrado');
        this.cerrarModal();
        this.obtenerProfesores();
        this.resetForm();
      },
      error: (err) => console.error('Error al registrar profesor:', err)
    });
  }

  editarProfesor(): void {
    const datos = this.prepararFormulario();
    this.profesorService.editarProfesor(this.idSeleccionado, datos).subscribe({
      next: () => {
        this.alertaExitosa('modificado');
        this.cerrarModal();
        this.obtenerProfesores();
        this.resetForm();
      },
      error: (err) => console.error('Error al modificar profesor:', err)
    });
  }

  obtenerProfesorPorId(id: number): void {
    this.profesorService.obtenerProfesorPorId(id).subscribe({
      next: (data) => {
        const profesor = data.profesor;
        this.formProfesor.setValue({
          nombres: profesor.nombres,
          apellidos: profesor.apellidos,
          dni: profesor.dni,
          telefono: profesor.telefono,
          correo: profesor.correo,
          idGenero: profesor.genero?.idGenero || '',
          idPais: profesor.pais?.idPais || '',
          idDistrito: profesor.distrito?.idDistrito || '',
          idEstado: profesor.estado?.idEstado || ''
        });
      },
      error: (err) => console.error('Error al obtener profesor:', err)
    });
  }

  titulo(accion: string, id?: number): void {
    this.title = `${accion} profesor`;
    this.nameBoton = accion === 'Crear' ? 'Guardar' : 'Modificar';

    if (accion === 'Editar' && id != null) {
      this.idSeleccionado = id;
      this.obtenerProfesorPorId(id);
      this.mostrarModal();
    } else {
      this.resetForm();
      this.mostrarModal();
    }
  }

  crearProfesor(): void {
    if (this.formProfesor.invalid) {
      Swal.fire('Formulario incompleto', 'Completa todos los campos', 'warning');
      return;
    }

    const mensaje = this.nameBoton === 'Guardar' ? 'registrar' : 'modificar';
    Swal.fire({
      title: `¿Estás seguro de ${mensaje} el profesor?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${mensaje}`,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.nameBoton === 'Guardar' ? this.registrarProfesor() : this.editarProfesor();
      }
    });
  }

  alertaExitosa(mensaje: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `Profesor ${mensaje} correctamente`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('modalProfesor');
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
    this.formProfesor.reset();
    this.formProfesor.markAsPristine();
    this.formProfesor.markAsUntouched();
  }

  cerrarBoton(): void {
    this.resetForm();
    this.cerrarModal();
  }

  mostrarModal(): void {
    const modalElement = document.getElementById('modalProfesor');
    if (modalElement) {
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
      }
      modalInstance.show();
    }
  }

  cargarCombos(): void {
    this.profesorService.obtenerGeneros().subscribe({
      next: (data) => this.listaGeneros = data.generos,
      error: (err) => console.error('Error al cargar géneros:', err)
    });

    this.profesorService.obtenerPaises().subscribe({
      next: (data) => this.listaPaises = data.paises,
      error: (err) => console.error('Error al cargar países:', err)
    });

    this.profesorService.obtenerDistritos().subscribe({
      next: (data) => this.listaDistritos = data.distritos,
      error: (err) => console.error('Error al cargar distritos:', err)
    });

    this.profesorService.obtenerEstados().subscribe({
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
