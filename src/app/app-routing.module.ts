import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { AlumnosScreenComponent } from './screens/alumnos-screen/alumnos-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { MaestrosScreenComponent } from './screens/maestros-screen/maestros-screen.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { RegistroMateriasScreenComponent } from './screens/registro-materias-screen/registro-materias-screen.component';
// 1. Importar el nuevo componente
import { MateriasScreenComponent } from './screens/materias-screen/materias-screen.component'; 

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginScreenComponent },
      { path: 'registro-usuarios', component: RegistroUsuariosScreenComponent },
      { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreenComponent }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'home', component: HomeScreenComponent },
      { path: 'administrador', component: AdminScreenComponent },
      { path: 'alumnos', component: AlumnosScreenComponent },
      { path: 'maestros', component: MaestrosScreenComponent },
      { path: 'graficas', component: GraficasScreenComponent },
      { path: 'registro-materias', component: RegistroMateriasScreenComponent },
      // 2. Agregar ruta para edición (opcional, para futuro uso)
      { path: 'registro-materias/:id', component: RegistroMateriasScreenComponent }, 
      // 3. Agregar la ruta de la lista
      { path: 'lista-materias', component: MateriasScreenComponent } 
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }