import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AlumnoService } from '../../servicio/alumno.service';
import { LoginService } from '../../servicio/login.service';

declare var bootstrap: any;

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  listaAlumnos: any[] = [];
  listaGeneros: any[] = [];
  listaPaises: any[] = [];
  listaDistritos: any[] = [];
  listaEstados: any[] = [];

  formAlumno!: FormGroup;
  title = '';
  nameBoton = '';
  idSeleccionado!: number;

  constructor(
    private alumnoService: AlumnoService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.obtenerAlumnos();
    this.cargarCombos(); // Ahora con servicio
  }

  initForm(): void {
    this.formAlumno = new FormGroup({
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

  filtroNombre: string = '';
  listaAlumnosOriginal: any[] = [];

  obtenerAlumnos(): void {
    this.alumnoService.listaAlumnos().subscribe({
      next: (data) => {
        this.listaAlumnosOriginal = data.alumnos;
        this.listaAlumnos = [...this.listaAlumnosOriginal]; // Copia para filtrar
      },
      error: (err) => console.error('Error al cargar alumnos:', err)
    });
  }

  filtrarAlumnos(): void {
    const filtro = this.filtroNombre.toLowerCase();
    this.listaAlumnos = this.listaAlumnosOriginal.filter(alumno =>
      alumno.nombres.toLowerCase().includes(filtro) ||
      alumno.apellidos.toLowerCase().includes(filtro) ||
      alumno.dni.includes(filtro)
    );
  }


  prepararFormulario(): any {
    const form = this.formAlumno.value;
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

  registrarAlumno(): void {
    const datos = this.prepararFormulario();
    this.alumnoService.crearAlumno(datos).subscribe({
      next: () => {
        this.alertaExitosa('registrado');
        this.cerrarModal();
        this.obtenerAlumnos();
        this.resetForm();
      },
      error: (err) => console.error('Error al registrar alumno:', err)
    });
  }

  editarAlumno(): void {
    const datos = this.prepararFormulario();
    this.alumnoService.editarAlumno(this.idSeleccionado, datos).subscribe({
      next: () => {
        this.alertaExitosa('modificado');
        this.cerrarModal();
        this.obtenerAlumnos();
        this.resetForm();
      },
      error: (err) => console.error('Error al modificar alumno:', err)
    });
  }

  obtenerAlumnoPorId(id: number): void {
    this.alumnoService.obtenerAlumnoPorId(id).subscribe({
      next: (data) => {
        const alumno = data.alumno;
        this.formAlumno.setValue({
          nombres: alumno.nombres,
          apellidos: alumno.apellidos,
          dni: alumno.dni,
          telefono: alumno.telefono,
          correo: alumno.correo,
          idGenero: alumno.genero?.idGenero || '',
          idPais: alumno.pais?.idPais || '',
          idDistrito: alumno.distrito?.idDistrito || '',
          idEstado: alumno.estado?.idEstado || ''
        });
      },
      error: (err) => console.error('Error al obtener alumno:', err)
    });
  }

  titulo(accion: string, id?: number): void {
    this.title = `${accion} alumno`;
    this.nameBoton = accion === 'Crear' ? 'Guardar' : 'Modificar';

    this.cargarCombos(); // Asegúrate de que los combos estén cargados

    if (accion === 'Editar' && id != null) {
      this.idSeleccionado = id;

      this.alumnoService.obtenerAlumnoPorId(id).subscribe({
        next: (data) => {
          const alumno = data.alumno;

          // 🔍 Verifica en consola los datos obtenidos
          console.log('Alumno obtenido para edición:', alumno);

          this.formAlumno.patchValue({
            nombres: alumno.nombres,
            apellidos: alumno.apellidos,
            dni: alumno.dni,
            telefono: alumno.telefono,
            correo: alumno.correo,
            idGenero: alumno.genero?.idGenero,
            idPais: alumno.pais?.idPais,
            idDistrito: alumno.distrito?.idDistrito,
            idEstado: alumno.estado?.idEstado
          });

          this.mostrarModal();
        },
        error: (err) => console.error('Error al obtener alumno:', err)
      });
    } else {
      this.resetForm();
      this.mostrarModal();
    }
  }






  crearAlumno(): void {
    if (this.formAlumno.invalid) {
      Swal.fire('Formulario incompleto', 'Completa todos los campos', 'warning');
      return;
    }

    const mensaje = this.nameBoton === 'Guardar' ? 'registrar' : 'modificar';
    Swal.fire({
      title: `¿Estás seguro de ${mensaje} el alumno?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${mensaje}`,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.nameBoton === 'Guardar' ? this.registrarAlumno() : this.editarAlumno();
      }
    });
  }

  alertaExitosa(mensaje: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `Alumno ${mensaje} correctamente`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('modalAlumno');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();

        // Retrasa la eliminación del backdrop
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open'); // 👈 importante
        }, 500);
      }
    }
  }


  resetForm(): void {
    this.formAlumno.reset();
    this.formAlumno.markAsPristine();
    this.formAlumno.markAsUntouched();
  }

  cerrarBoton(): void {
    this.resetForm();
    this.cerrarModal();
  }
  mostrarModal(): void {
    const modalElement = document.getElementById('modalAlumno');
    if (modalElement) {
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
      }
      modalInstance.show();
    }
  }


  logout(): void {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.loginService.logout();
        this.router.navigate(['login']);
      }
    });
  }

  // CARGAR COMBOS DESDE API CON TOKEN
  cargarCombos(): void {
    this.alumnoService.obtenerGeneros().subscribe({
      next: (data) => this.listaGeneros = data.generos,
      error: (err) => console.error('Error al cargar géneros:', err)
    });

    this.alumnoService.obtenerPaises().subscribe({
      next: (data) => this.listaPaises = data.paises,
      error: (err) => console.error('Error al cargar países:', err)
    });

    this.alumnoService.obtenerDistritos().subscribe({
      next: (data) => this.listaDistritos = data.distritos,
      error: (err) => console.error('Error al cargar distritos:', err)
    });

    this.alumnoService.obtenerEstados().subscribe({
      next: (data) => this.listaEstados = data.estados,
      error: (err) => console.error('Error al cargar estados:', err)
    });

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

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;

    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  }
  abrirModal() {
    const modalElement = document.getElementById('modalAlumno');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

}
