import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort'; // Importar MatSort
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {
  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];

  // Configuración de columnas
  displayedColumns: string[] = ['nrc', 'nombre', 'seccion', 'dias', 'horario', 'salon', 'programa', 'editar', 'eliminar'];
  
  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  // Paginador y Ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private materiasService: MateriasService,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    
    // Validar sesión
    this.token = this.facadeService.getSessionToken();
    if(this.token == ""){
      this.router.navigate(["/"]);
    }

    // Obtener materias al iniciar
    this.obtenerMaterias();
  }

  // Obtener lista de materias
  public obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;
        console.log("Lista materias: ", this.lista_materias);
        
        if (this.lista_materias.length > 0) {
          // Asignamos los datos al dataSource
          this.dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
          
          // Vinculamos paginador y sort después de obtener los datos
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        console.error("Error al obtener materias", error);
        alert("Error al obtener la lista de materias");
      }
    );
  }

  // Filtrado (Búsqueda por NRC y Nombre principalmente)
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Navegar a edición
  public goEditar(id: number) {
    this.router.navigate(['registro-materias', id]);
  }

  // Eliminar materia
  public delete(id: number) {
    const confirmDelete = confirm("¿Estás seguro de eliminar esta materia?");
    if (confirmDelete) {
      this.materiasService.eliminarMateria(id).subscribe(
        (response) => {
          alert("Materia eliminada correctamente");
          this.obtenerMaterias(); // Recargar tabla
        },
        (error) => {
          console.error("Error al eliminar", error);
          alert("No se pudo eliminar la materia");
        }
      );
    }
  }

  // Helper para mostrar días en la tabla
  public formatearDias(dias: any): string {
    if (Array.isArray(dias)) {
      return dias.join(', ');
    }
    return dias; 
  }
}

// Interfaz para tipado estricto
export interface DatosMateria {
  id: number;
  nrc: number;
  nombre: string;
  seccion: string;
  dias: string[];
  hora_inicio: string;
  hora_fin: string;
  salon: string;
  programa_educativo: string;
}