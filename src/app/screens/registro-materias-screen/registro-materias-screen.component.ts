import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'; // Importar ValidatorFn, ValidationErrors, AbstractControl
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit {
  
  public titulo: string = "Registro de Materia";
  public editar: boolean = false;
  public idMateria: number = 0;
  
  public lista_maestros: any[] = [];
  public programas: string[] = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];
  public dias_semana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  public materiaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService,
    private facadeService: FacadeService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) {
    this.materiaForm = this.formBuilder.group({
      nrc: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(5)]],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$')]],
      seccion: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)]],
      dias: [[], [Validators.required]],
      hora_inicio: ['', [Validators.required]],
      hora_fin: ['', [Validators.required]],
      salon: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$'), Validators.maxLength(15)]],
      programa_educativo: ['', [Validators.required]],
      profesor_id: ['', [Validators.required]],
      creditos: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]],
    }, { validators: this.validarHorario }); // <--- Agregamos la validación grupal aquí
  }

  // Función de validación personalizada
  public validarHorario: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const inicio = control.get('hora_inicio')?.value;
    const fin = control.get('hora_fin')?.value;

    // Validar solo si ambos tienen valor
    if (inicio && fin) {
      // Comparación de cadenas de tiempo (formato 24h HH:mm funciona bien con operadores < >)
      if (inicio >= fin) {
        return { horarioInvalido: true }; // Retorna error si inicio es mayor o igual a fin
      }
    }
    return null; // Sin errores
  };

  ngOnInit(): void {
    // 1. Validar sesión
    if (this.facadeService.getSessionToken() == "") {
      this.router.navigate(["/"]);
    }

    // 2. PASO 1: Obtener la lista de maestros (Prioridad Alta)
    this.maestrosService.obtenerListaMaestros().subscribe(
      (responseMaestros) => {
        // Guardamos la lista
        this.lista_maestros = responseMaestros;
        // Formateamos los nombres para el select
        this.lista_maestros.forEach(element => {
          element.nombre_completo = element.user.first_name + " " + element.user.last_name;
        });

        // 3. PASO 2: Solo ahora verificamos si es edición
        if (this.activeRoute.snapshot.params['id'] != undefined) {
          this.editar = true;
          this.idMateria = this.activeRoute.snapshot.params['id'];
          this.titulo = "Actualizar Materia";

          // 4. Llamamos a la materia (Ya es seguro porque tenemos la lista de maestros cargada)
          this.materiasService.obtenerMateria(this.idMateria).subscribe(
            (responseMateria) => {
              console.log("Datos de la materia:", responseMateria);
              const datos = { ...responseMateria };

              // --- CORRECCIÓN DE PROFESOR ---
              if (datos.profesor) {
                if (typeof datos.profesor === 'object') {
                  datos.profesor_id = datos.profesor.id;
                } else {
                  datos.profesor_id = datos.profesor;
                }
              }

              // --- CORRECCIÓN DE HORARIOS ---
              if(datos.hora_inicio && datos.hora_inicio.length > 5){
                 datos.hora_inicio = datos.hora_inicio.substring(0, 5);
              }
              if(datos.hora_fin && datos.hora_fin.length > 5){
                 datos.hora_fin = datos.hora_fin.substring(0, 5);
              }
              
              // --- CORRECCIÓN DE DÍAS ---
              if(!datos.dias){
                datos.dias = [];
              }

              // Llenar el formulario
              this.materiaForm.patchValue(datos);
            },
            (error) => { console.log("Error al obtener materia:", error); }
          );
        }
      },
      (error) => { console.log("Error al obtener maestros:", error); }
    );
  }

  public obtenerMaestros(){
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response)=>{
        this.lista_maestros = response;
        this.lista_maestros.forEach(element => {
          element.nombre_completo = element.user.first_name + " " + element.user.last_name;
        });
      },
      (error)=>{ console.log(error); }
    );
  }

  public registrar(){
    if(this.materiaForm.invalid){
      this.materiaForm.markAllAsTouched();
      alert("Por favor verifica los campos marcados en rojo.");
      return;
    }
    // ... Resto de la lógica de registro (igual que antes)
    const datos = this.materiaForm.value;
    if(this.editar){
      datos.id = this.idMateria;
      this.materiasService.actualizarMateria(datos).subscribe(
        (response)=>{
          alert("Materia actualizada correctamente");
          this.router.navigate(['/lista-materias']);
        }, 
        (error)=>{ alert("Error al actualizar"); }
      );
    } else {
      this.materiasService.validarNRC(datos.nrc).subscribe(
        (res) => {
          if(!res.disponible){
            alert("El NRC ya existe");
            this.materiaForm.get('nrc')?.setErrors({'duplicate': true});
          } else {
            this.materiasService.registrarMateria(datos).subscribe(
              (response)=>{
                alert("Materia registrada correctamente");
                this.router.navigate(['/lista-materias']);
              },
              (error)=>{ alert("Error al registrar"); }
            );
          }
        }
      );
    }
  }

  public regresar(){ this.location.back(); }

  public soloNumeros(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) { event.preventDefault(); }
  }
  public soloLetras(event: any) {
    const pattern = /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) { event.preventDefault(); }
  }
  public alfaNumerico(event: any) {
    const pattern = /[a-zA-Z0-9 ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) { event.preventDefault(); }
  }

  get f() { return this.materiaForm.controls; }
}