import { COMPONENT } from './interfaces/route-names';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: COMPONENT.LOGIN,
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: COMPONENT.INTRO,
    loadChildren: () => import('./pages/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: COMPONENT.INSIDE,
    loadChildren: () => import('./inside/inside.module').then(m => m.InsidePageModule),
    canLoad: [AuthGuard], // Secure all child pages
  },
  // {
  //   path:'.well-known/matrix/server'
  //   // redirectTo:'.well-known/matrix/server'
  // },{
  //   path:'.well-known/matrix/client'
  //   // redirectTo:'.well-known/matrix/server'
  // },
  {
    path: '',
    redirectTo: '/' + COMPONENT.LOGIN,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/' + COMPONENT.LOGIN,
    pathMatch: 'full'
  },
    // {
  //   path: 'insert-musician-data-modal',
  //   loadChildren: () => import('./pages/musician/insert-musician-data-modal/insert-musician-data-modal.module').then( m => m.InsertMusicianDataModalPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],

})
export class AppRoutingModule { }
