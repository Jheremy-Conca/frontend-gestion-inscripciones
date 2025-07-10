import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SalonService } from '../../servicio/salon.service';
import { LoginService } from '../../servicio/login.service';

declare var bootstrap: any;

@Component({
  selector: 'app-salones',
  templateUrl: './salon.component.html',
  styleUrls: ['./salon.component.css']
})
export class SalonesComponent implements OnInit {

  listaSalones: any[] = [];
  listaSalonesOriginal: any[] = [];
  listaTipos: any[] = []; // ✅ Para cargar los tipos de salón (como "Aula", "Laboratorio", etc.)
  listaEstados: any[] = [];

  formSalon!: FormGroup;
  title = '';
  nameBoton = '';
  idSeleccionado!: number;
  filtroNombre: string = '';

  constructor(
    private salonService: SalonService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.obtenerSalones();
    this.cargarCombos();
  }

  initForm(): void {
    this.formSalon = new FormGroup({
      numeroSalon: new FormControl('', Validators.required),
      piso: new FormControl('', Validators.required),
      capacidad: new FormControl('', Validators.required),
      idTipoSalon: new FormControl('', Validators.required),
      idEstado: new FormControl('', Validators.required)
    });
  }

  obtenerSalones(): void {
    this.salonService.listaSalones().subscribe({
      next: (data) => {
        this.listaSalonesOriginal = data.salones;
        this.listaSalones = [...this.listaSalonesOriginal];
      },
      error: (err) => console.error('Error al cargar salones:', err)
    });
  }

  filtrarSalones(): void {
    const filtro = this.filtroNombre.toLowerCase();
    this.listaSalones = this.listaSalonesOriginal.filter(salon =>
      salon.numeroSalon.toLowerCase().includes(filtro) ||
      salon.tipoSalon.descripcionSalon.toLowerCase().includes(filtro)
    );
  }

  titulo(accion: string, id?: number): void {
    this.title = `${accion} salón`;
    this.nameBoton = accion === 'Crear' ? 'Guardar' : 'Modificar';
    this.cargarCombos();

    if (accion === 'Editar' && id != null) {
      this.idSeleccionado = id;
      this.salonService.obtenerSalonPorId(id).subscribe({
        next: (data) => {
          const salon = data.salon;
          this.formSalon.patchValue({
            numeroSalon: salon.numeroSalon,
            piso: salon.piso,
            capacidad: salon.capacidad,
            idTipoSalon: salon.tipoSalon?.idTipoSalon,
            idEstado: salon.estado?.idEstado
          });
          this.mostrarModal();
        },
        error: (err) => console.error('Error al obtener salón:', err)
      });
    } else {
      this.resetForm();
      this.mostrarModal();
    }
  }

  prepararFormulario(): any {
    const form = this.formSalon.value;
    return {
      numeroSalon: form.numeroSalon,
      piso: form.piso,
      capacidad: form.capacidad,
      tipoSalon: { idTipoSalon: form.idTipoSalon },
      estado: { idEstado: form.idEstado }
    };
  }

  crearSalon(): void {
    if (this.formSalon.invalid) {
      Swal.fire('Formulario incompleto', 'Completa todos los campos', 'warning');
      return;
    }

    const mensaje = this.nameBoton === 'Guardar' ? 'registrar' : 'modificar';
    Swal.fire({
      title: `¿Estás seguro de ${mensaje} el salón?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${mensaje}`,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.nameBoton === 'Guardar' ? this.registrarSalon() : this.editarSalon();
      }
    });
  }

  registrarSalon(): void {
    const datos = this.prepararFormulario();
    this.salonService.crearSalon(datos).subscribe({
      next: () => {
        this.alertaExitosa('registrado');
        this.cerrarModal();
        this.obtenerSalones();
        this.resetForm();
      },
      error: (err) => console.error('Error al registrar salón:', err)
    });
  }

  editarSalon(): void {
    const datos = this.prepararFormulario();
    this.salonService.editarSalon(this.idSeleccionado, datos).subscribe({
      next: () => {
        this.alertaExitosa('modificado');
        this.cerrarModal();
        this.obtenerSalones();
        this.resetForm();
      },
      error: (err) => console.error('Error al modificar salón:', err)
    });
  }

  alertaExitosa(mensaje: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `Salón ${mensaje} correctamente`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  resetForm(): void {
    this.formSalon.reset();
    this.formSalon.markAsPristine();
    this.formSalon.markAsUntouched();
  }

  mostrarModal(): void {
    const modalElement = document.getElementById('modalSalon');
    if (modalElement) {
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
      }
      modalInstance.show();
    }
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('modalSalon');
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

  cerrarBoton(): void {
    this.resetForm();
    this.cerrarModal();
  }

  cargarCombos(): void {
    this.salonService.obtenerTipoSalon().subscribe({
      next: (data) => this.listaTipos = data.tiposSalon, // ✅ aquí el cambio importante
      error: (err) => console.error('Error al cargar tipos de salón:', err)
    });


    this.salonService.obtenerEstados().subscribe({
      next: (data) => this.listaEstados = data.estados,
      error: (err) => console.error('Error al cargar estados:', err)
    });
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

  sidebarVisible = true;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    const wrapper = document.getElementById('wrapper');
    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  }

  abrirModal() {
    const modalElement = document.getElementById('modalSalon');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
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
