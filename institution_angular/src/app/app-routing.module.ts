import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



//------------------------------
const routes: Routes = [

  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'owner', loadChildren: () => import('./pages/owner/owner.module').then(m => m.OwnerModule) },
  { path: 'developer', loadChildren: () => import('./pages/developer/developer.module').then(m => m.DeveloperModule) },

  { path: 'Sidenav', loadChildren: () => import('./sidenavs/sidenav/sidenav.module').then(m => m.SidenavModule) },

  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },

  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },

  { path: 'Header', loadChildren: () => import('./header/header.module').then(m => m.HeaderModule) },

  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },

  { path: 'Owner', loadChildren: () => import('./pages/owner/owner.module').then(m => m.OwnerModule) },

  { path: 'SidenavOwner', loadChildren: () => import('./sidenavs/sidenav-owner/sidenav-owner.module').then(m => m.SidenavOwnerModule) },

  { path: 'developer', loadChildren: () => import('./pages/developer/developer.module').then(m => m.DeveloperModule) },

  { path: 'SidenavDeveloper', loadChildren: () => import('./sidenavs/sidenav-developer/sidenav-developer.module').then(m => m.SidenavDeveloperModule) },

  { path: 'student', loadChildren: () => import('./pages/student/student.module').then(m => m.StudentModule) },

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
