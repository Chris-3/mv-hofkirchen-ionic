import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('../pages/login/login.module').then( m => m.LoginPageModule),
    canLoad:[IntroGuard, AutoLoginGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('../pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'inside',
    loadChildren: () => import('./inside/inside.module').then( m => m.InsidePageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
 
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }
