import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient, 
    private facadeService: FacadeService
  ) { }

  // Función para obtener el esquema vacío (ayuda a limpiar el componente)
  public esquemaMateria(){
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias': [],
      'hora_inicio': '',
      'hora_fin': '',
      'salon': '',
      'programa_educativo': '',
      'profesor_id': null,
      'creditos': null
    }
  }

  // Validar NRC (Manteniendo la lógica que tenías)
  public validarNRC(nrc: string): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<any>(`${environment.url_api}/materias-validar/?nrc=${nrc}`, { headers: headers });
  }

  // Obtener lista completa de materias
  public obtenerListaMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<any>(`${environment.url_api}/materias`, { headers: headers });
  }

  // Obtener una sola materia por ID (Para la edición)
  public obtenerMateria(id: Number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<any>(`${environment.url_api}/materias/${id}`, { headers: headers });
  }

  // Registrar una nueva materia
  public registrarMateria(materia: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post<any>(`${environment.url_api}/materias`, materia, { headers: headers });
  }

  // Actualizar una materia existente
  public actualizarMateria(materia: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    // Se asume que el ID viene dentro del objeto materia o se pasa en la URL
    return this.http.put<any>(`${environment.url_api}/materias/${materia.id}`, materia, { headers: headers });
  }

  // Eliminar materia
  public eliminarMateria(id: Number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.delete<any>(`${environment.url_api}/materias/${id}`, { headers: headers });
  }
}