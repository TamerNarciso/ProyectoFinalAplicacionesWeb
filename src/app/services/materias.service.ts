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

  // Validar NRC
  public validarNRC(nrc: string): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    // Asegúrate de agregar esta ruta en tu urls.py
    return this.http.get<any>(`${environment.url_api}/materias-validar/?nrc=${nrc}`, { headers: headers });
  }

  // CORREGIDO: Apunta a 'lista-materias/'
  public obtenerListaMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers: headers });
  }

  // CORREGIDO: Usa Query Param (?id=...) en lugar de URL param
  public obtenerMateria(id: Number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get<any>(`${environment.url_api}/materias/?id=${id}`, { headers: headers });
  }

  // Registrar (POST a /materias/) - ESTE ESTABA BIEN
  public registrarMateria(materia: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.post<any>(`${environment.url_api}/materias/`, materia, { headers: headers });
  }

  // CORREGIDO: PUT a /materias/ (sin ID en URL, el ID va en el body)
  public actualizarMateria(materia: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.put<any>(`${environment.url_api}/materias/`, materia, { headers: headers });
  }

  // CORREGIDO: DELETE con Query Param (?id=...)
  public eliminarMateria(id: Number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.delete<any>(`${environment.url_api}/materias/?id=${id}`, { headers: headers });
  }
}