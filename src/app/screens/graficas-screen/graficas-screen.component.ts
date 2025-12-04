import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MateriasService } from 'src/app/services/materias.service'; // <--- 1. Importar MateriasService

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  public total_user: any = {};

  lineChartData: any = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        label: 'Materias impartidas por día',
        backgroundColor: '#F88406'
      }
    ]
  };
  lineChartOption = {
    responsive: false
  }
  lineChartPlugins = [DatalabelsPlugin];

  barChartData = {
    labels: ["Congreso", "FePro", "Presentación Doctoral", "Feria Matemáticas", "T-System"],
    datasets: [
      {
        data: [34, 43, 54, 28, 74],
        label: 'Eventos Académicos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  barChartOption = {
    responsive: false
  }
  barChartPlugins = [DatalabelsPlugin];

  pieChartData: any = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [{ data: [0, 0, 0], label: 'Registro de usuarios', backgroundColor: ['#FCFF44', '#F1C8F2', '#31E731'] }]
  };
  pieChartOption = {
    responsive: false
  }
  pieChartPlugins = [DatalabelsPlugin];

  doughnutChartData: any = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [{ data: [0, 0, 0], label: 'Registro de usuarios', backgroundColor: ['#F88406', '#FCFF44', '#31E7E7'] }]
  };
  doughnutChartOption = {
    responsive: false
  }
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService,
    private materiasService: MateriasService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
    this.obtenerDatosMaterias();
  }

  // Obtener total de usuarios (Pastel y Dona)
  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        this.total_user = response;
        // Actualizar Pie Chart
        this.pieChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],
          datasets: [{
            data: [this.total_user.admins, this.total_user.maestros, this.total_user.alumnos],
            label: 'Registro de usuarios',
            backgroundColor: ['#FCFF44', '#F1C8F2', '#31E731']
          }]
        };
        // Actualizar Doughnut Chart
        this.doughnutChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],
          datasets: [{
            data: [this.total_user.admins, this.total_user.maestros, this.total_user.alumnos],
            label: 'Registro de usuarios',
            backgroundColor: ['#F88406', '#FCFF44', '#31E7E7']
          }]
        };
      }, (error) => {
        console.error(error);
      }
    );
  }

  public obtenerDatosMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        // Inicializamos contadores
        const conteo: any = {
          "Lunes": 0, "Martes": 0, "Miércoles": 0, "Jueves": 0, "Viernes": 0, "Sábado": 0
        };


        response.forEach((materia: any) => {
          if (materia.dias && Array.isArray(materia.dias)) {
            materia.dias.forEach((dia: string) => {
              if (conteo[dia] !== undefined) {
                conteo[dia]++;
              }
            });
          }
        });

        console.log("Conteo de materias por día:", conteo);

        this.lineChartData = {
          labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
          datasets: [
            {
              data: [
                conteo["Lunes"],
                conteo["Martes"],
                conteo["Miércoles"],
                conteo["Jueves"],
                conteo["Viernes"],
                conteo["Sábado"]
              ],
              label: 'Materias impartidas por día',
              backgroundColor: '#F88406',
              borderColor: '#F88406',
              fill: false
            }
          ]
        };

      },
      (error) => {
        console.error("Error al obtener materias:", error);
      }
    );
  }
}