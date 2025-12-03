import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit {

  // Variables principales
  public materia: any = {};
  public editar: boolean = false;
  public idMateria: Number = 0;
  public errors: any = {};

  // Catálogos y listas
  public lista_maestros: any[] = [];
  public programas: string[] = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];
  public dias_semana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Para el control de la vista (loading, etc)
  public cargandoMaestros: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private maestrosService: MaestrosService,
    private materiasService: MateriasService
  ) { }

  ngOnInit(): void {
    // 1. Cargar catálogo de maestros
    this.cargarMaestros();

    // 2. Verificar si es edición o registro nuevo
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      console.log("ID Materia: ", this.idMateria);
      
      // Aquí deberías llamar al servicio para obtener los datos de la materia por ID
      // Como ejemplo, simulamos la llamada:
      this.materiasService.obtenerMateria(this.idMateria).subscribe(
        (response: any) => {
          this.materia = response;
          // Aseguramos que los días vengan en formato correcto si es necesario
          if(!this.materia.dias) this.materia.dias = [];
        },
        (error: any) => {
          alert("Error al cargar la materia");
        }
      );

    } else {
      // Inicializamos el esquema vacío si es registro nuevo
      this.limpiarFormulario();
    }
  }

  // Función para inicializar/limpiar el objeto materia
  public limpiarFormulario(){
    this.materia = {
      nrc: '',
      nombre: '',
      seccion: '',
      dias: [], // Array para guardar los días seleccionados
      hora_inicio: '',
      hora_fin: '',
      salon: '',
      programa_educativo: '',
      profesor_id: null,
      creditos: null
    };
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    // 1. Validar formulario
    if(!this.validarFormulario()){
      return;
    }

    // 2. Consumir servicio de registro
    this.materiasService.registrarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia registrada exitosamente");
        console.log("Materia registrada: ", response);
        this.router.navigate(["materias"]); // O la ruta donde listas las materias
      },
      (error) => {
        alert("Error al registrar materia");
        console.error("Error: ", error);
      }
    );
  }

  public actualizar(){
    // 1. Validar formulario
    if(!this.validarFormulario()){
      return;
    }

    // 2. Consumir servicio de actualización
    this.materiasService.actualizarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia actualizada exitosamente");
        console.log("Materia actualizada: ", response);
        this.router.navigate(["materias"]);
      },
      (error) => {
        alert("Error al actualizar materia");
        console.error("Error: ", error);
      }
    );
  }

  // -------------------------------------------------------------------------
  // Validaciones (Similar a como lo hace el servicio de alumnos, pero local)
  // -------------------------------------------------------------------------
  public validarFormulario(): boolean {
    this.errors = {};

    if(!this.materia.nrc || this.materia.nrc.length < 5){
      this.errors.nrc = "El NRC es obligatorio y debe tener al menos 5 dígitos.";
    }
    if(!this.materia.nombre){
      this.errors.nombre = "El nombre de la materia es obligatorio.";
    }
    if(!this.materia.seccion){
      this.errors.seccion = "La sección es obligatoria.";
    }
    if(!this.materia.hora_inicio || !this.materia.hora_fin){
      this.errors.horario = "Debe establecer hora de inicio y fin.";
    }
    if(this.materia.hora_inicio >= this.materia.hora_fin){
      this.errors.horario = "La hora de fin debe ser mayor a la de inicio.";
    }
    if(!this.materia.profesor_id){
      this.errors.profesor_id = "Debe seleccionar un profesor.";
    }

    // Retorna false si hay errores
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    return true;
  }

  // -------------------------------------------------------------------------
  // Funciones Auxiliares y de Formato
  // -------------------------------------------------------------------------

  // Carga y normaliza la lista de maestros (Lógica original conservada pero organizada)
  public cargarMaestros() {
    this.cargandoMaestros = true;
    this.maestrosService.obtenerListaMaestros().subscribe({
      next: (resp: any) => {
        // CORRECCIÓN AQUÍ: Agregamos el tipo explicitamente
        let lista: any[] = []; 
        
        // Lógica para detectar dónde viene el array en la respuesta
        if (Array.isArray(resp)) lista = resp;
        else if (resp.lista) lista = resp.lista;
        else if (resp.data) lista = resp.data;
        else if (resp.results) lista = resp.results;
        
        // Mapeo simplificado para el select
        this.lista_maestros = lista.map((m: any) => {
          const id = m.id || m.id_maestro || m.id_trabajador;
          // Intentar obtener el nombre de varias propiedades posibles
          let nombre = m.nombre || m.nombre_completo || m.full_name || 
                       (m.user ? m.user.first_name + ' ' + m.user.last_name : 'Sin Nombre');
          
          return { id: id, nombre: nombre };
        }).filter((m: any) => m.id != null);
        
        this.cargandoMaestros = false;
      },
      error: (err) => {
        console.error('Error cargando maestros', err);
        this.cargandoMaestros = false;
      }
    });
  }

  // Manejo de Checkboxes para días
  public toggleDia(dia: string, event: any){
    if(event.checked){
      this.materia.dias.push(dia);
    }else{
      this.materia.dias = this.materia.dias.filter((d: string) => d !== dia);
    }
  }

  // Verificación de si un día está seleccionado (útil para el modo Editar)
  public isDiaSelected(dia: string): boolean {
    return this.materia.dias ? this.materia.dias.includes(dia) : false;
  }

  // Validar NRC en tiempo real (Opcional, si quieres mantener la validación asíncrona)
  public changeNrc(event: any){
    // Solo permitir números
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.materia.nrc = value;
  }

  // Validación de solo letras para inputs de texto
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) && 
      !(charCode >= 97 && charCode <= 122) && 
      charCode !== 32 
    ) {
      event.preventDefault();
    }
  }
  
  // Validación de solo números
  public soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}