import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';

import { InsidePage } from './inside.page';

const routes: Routes = [
  
  {
    path: 'home',
    loadChildren: () => import('../../pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home/upload',
    loadChildren: () => import('../../pages/file-modal/file-modal.module').then( m => m.FileModalPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('../../pages/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsidePageRoutingModule {}
