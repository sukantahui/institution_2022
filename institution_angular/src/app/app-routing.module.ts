import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StudentResolver} from "./resolvers/student.resolver";
import {AuthGuard} from "./services/auth.guard";
import {AuthOwnerGuard} from "./services/auth-owner.guard";



//------------------------------
const routes: Routes = [

  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  {
    path: 'student',
    canActivate : [AuthGuard,AuthOwnerGuard],
    loadChildren: () => import('./pages/student/student.module')
      .then(mod => mod.StudentModule),
    resolve: {studentResolverData: StudentResolver},
    data: {loginType: 'owner'},

  },
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

  { path: 'LineChart', loadChildren: () => import('./pages/developer/charts/line-chart/line-chart.module').then(m => m.LineChartModule) },

  { path: 'BarChart', loadChildren: () => import('./pages/developer/charts/bar-chart/bar-chart.module').then(m => m.BarChartModule) },

];



@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
