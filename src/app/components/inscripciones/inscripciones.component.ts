import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { InscripcionService } from '../../servicio/inscripcion.service';
import { saveAs } from 'file-saver'; // Permite descargar archivos en el navegador
import * as ExcelJS from 'exceljs';//Permite crear y editar archivos Excel
declare var bootstrap: any;

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit {

  listaInscripciones: any[] = [];
  listaAlumnos: any[] = [];
  listaCursos: any[] = [];
  listaSalones: any[] = [];
  listaEstados: any[] = [];

  formInscripcion!: FormGroup;
  title = '';
  nameBoton = '';
  idSeleccionado!: number;

  sidebarVisible = true;
  // Filtros
  filtroNombreAlumno: string = '';
  filtroCurso: string = '';
  filtroCiclo: string = '';
  filtroProfesor: string = '';


  get inscripcionesFiltradas(): any[] {
    return this.listaInscripciones.filter(i => {
      const nombreAlumno = (i.alumno?.nombres + ' ' + i.alumno?.apellidos)?.toLowerCase() || '';
      const curso = i.curso?.nombreCurso?.toLowerCase() || '';
      const ciclo = i.ciclo?.toString() || '';
      const nombreProfesor = (i.curso?.profesor?.nombres + ' ' + i.curso?.profesor?.apellidos)?.toLowerCase() || '';

      return nombreAlumno.includes(this.filtroNombreAlumno.toLowerCase()) &&
        curso.includes(this.filtroCurso.toLowerCase()) &&
        ciclo.includes(this.filtroCiclo) &&
        nombreProfesor.includes(this.filtroProfesor.toLowerCase());
    });
  }

  constructor(
    private inscripcionService: InscripcionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.obtenerInscripciones();
    this.cargarCombos();
  }

  initForm(): void {
    this.formInscripcion = new FormGroup({
      idAlumno: new FormControl('', Validators.required),
      idCurso: new FormControl('', Validators.required),
      idSalon: new FormControl('', Validators.required),
      idEstado: new FormControl('', Validators.required),
      ciclo: new FormControl('', Validators.required),

    });
  }

  obtenerInscripciones(): void {
    this.inscripcionService.listaInscripciones().subscribe({
      next: (data) => this.listaInscripciones = data.inscripciones,
      error: (err) => console.error('Error al cargar inscripciones:', err)
    });
  }

  prepararFormulario(): any {
    const form = this.formInscripcion.value;
    return {
      alumno: { idAlumno: form.idAlumno },
      curso: { idCurso: form.idCurso },
      salon: { idSalon: form.idSalon },
      estado: { idEstado: form.idEstado },
      ciclo: form.ciclo // ✅ Agregar ciclo correctamente
    };
  }


  registrarInscripcion(): void {
    const datos = this.prepararFormulario();
    this.inscripcionService.crearInscripcion(datos).subscribe({
      next: () => {
        this.alertaExitosa('registrada');
        this.cerrarModal();
        this.obtenerInscripciones();
        this.resetForm();
      },
      error: (err) => console.error('Error al registrar inscripción:', err)
    });
  }

  editarInscripcion(): void {
    const datos = this.prepararFormulario();
    this.inscripcionService.editarInscripcion(this.idSeleccionado, datos).subscribe({
      next: () => {
        this.alertaExitosa('modificada');
        this.cerrarModal();
        this.obtenerInscripciones();
        this.resetForm();
      },
      error: (err) => console.error('Error al modificar inscripción:', err)
    });
  }

  obtenerInscripcionPorId(id: number): void {
    this.inscripcionService.obtenerInscripcionPorId(id).subscribe({
      next: (data) => {
        const i = data.inscripcion;
        this.formInscripcion.setValue({
          idAlumno: i.alumno?.idAlumno || '',
          idCurso: i.curso?.idCurso || '',
          idSalon: i.curso?.salon?.idSalon || '', // ✅ Extraído desde curso
          idEstado: i.estado?.idEstado || '',
          ciclo: i.ciclo || ''
        });
      },
      error: (err) => console.error('Error al obtener inscripción:', err)
    });
  }

  titulo(accion: string, id?: number): void {
    this.title = `${accion} inscripción`;
    this.nameBoton = accion === 'Crear' ? 'Guardar' : 'Modificar';

    if (accion === 'Editar' && id != null) {
      this.idSeleccionado = id;
      this.obtenerInscripcionPorId(id);
      this.mostrarModal();
    } else {
      this.resetForm();
      this.mostrarModal();
    }
  }

  crearInscripcion(): void {
    if (this.formInscripcion.invalid) {
      Swal.fire('Formulario incompleto', 'Completa todos los campos', 'warning');
      return;
    }

    const mensaje = this.nameBoton === 'Guardar' ? 'registrar' : 'modificar';
    Swal.fire({
      title: `¿Estás seguro de ${mensaje} la inscripción?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${mensaje}`,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.nameBoton === 'Guardar' ? this.registrarInscripcion() : this.editarInscripcion();
      }
    });
  }

  alertaExitosa(mensaje: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `Inscripción ${mensaje} correctamente`,
      showConfirmButton: false,
      timer: 1500
    });
  }
  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inscripciones');

    // Definir columnas con encabezados y ancho
    worksheet.columns = [
      { header: 'Alumno', key: 'alumno', width: 25 },
      { header: 'Curso', key: 'curso', width: 20 },
      { header: 'Profesor', key: 'profesor', width: 25 },
      { header: 'Salón', key: 'salon', width: 10 },
      { header: 'Ciclo', key: 'ciclo', width: 10 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 15 }
    ];

    // Estilo para la cabecera
    worksheet.getRow(1).eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ADD8E6' }  // Celeste claro
      };
      cell.font = { bold: true, color: { argb: '000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
    });

    // Agregar filas de datos
    this.inscripcionesFiltradas.forEach(i => {
      worksheet.addRow({
        alumno: `${i.alumno?.nombres} ${i.alumno?.apellidos}`,
        curso: i.curso?.nombreCurso,
        profesor: `${i.curso?.profesor?.nombres} ${i.curso?.profesor?.apellidos}`,
        salon: i.curso?.salon?.numeroSalon,
        ciclo: i.ciclo,
        estado: i.estado?.descripcionEstado,
        fecha: new Date(i.fechaInscripcion).toLocaleDateString('es-PE')
      });
    });

    // Estilos para filas (contenido)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {  // Excluir cabecera
        row.eachCell(cell => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' } // Gris claro
          };
          cell.font = { color: { argb: '4F4F4F' } }; // Texto gris oscuro
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
        });
      }
    });

    // Guardar el archivo Excel
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `inscripciones_${new Date().toISOString().slice(0, 10)}.xlsx`);
    });
  }
  cerrarModal(): void {
    const modalElement = document.getElementById('modalInscripcion');
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
    this.formInscripcion.reset();
    this.formInscripcion.markAsPristine();
    this.formInscripcion.markAsUntouched();
  }

  cerrarBoton(): void {
    this.resetForm();
    this.cerrarModal();
  }

  mostrarModal(): void {
    const modalElement = document.getElementById('modalInscripcion');
    if (modalElement) {
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
      }
      modalInstance.show();
    }
  }

  cargarCombos(): void {
    this.inscripcionService.obtenerAlumnos().subscribe({
      next: (data) => this.listaAlumnos = data.alumnos,
      error: (err) => console.error('Error al cargar alumnos:', err)
    });

    this.inscripcionService.obtenerCursos().subscribe({
      next: (data) => this.listaCursos = data.cursos,
      error: (err) => console.error('Error al cargar cursos:', err)
    });

    this.inscripcionService.obtenerSalones().subscribe({
      next: (data) => this.listaSalones = data.salones,
      error: (err) => console.error('Error al cargar salones:', err)
    });

    this.inscripcionService.obtenerEstados().subscribe({
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
      icon: 'fa-solid fa-user-tie',
      expanded: false,
      children: [
        { label: 'Listado', link: '/profesores' }
      ]
    },
    {
      id: 'collapseAlumno',
      label: 'Alumnos',
      icon: 'fa-solid fa-user-graduate',
      expanded: false,
      children: [
        { label: 'Listado', link: '/alumnos' }
      ]
    },
    {
      id: 'collapseCurso',
      label: 'Curso',
      icon: 'fa-solid fa-book',
      expanded: false,
      children: [
        { label: 'Listado', link: '/cursos' }
      ]
    },
    {
      id: 'collapseInscripcion',
      label: 'Inscripción',
      icon: 'fa-solid fa-clipboard-check',
      expanded: false,
      children: [
        { label: 'Listado', link: '/inscripciones' }
      ]
    }
  ];


}
