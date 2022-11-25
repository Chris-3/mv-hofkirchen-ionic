import { COMPONENT } from './../interfaces/route-names';
import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';

import { InsidePage } from './inside.page';

const routes: Routes = [
  
  {
    path: '',
    component: InsidePage,
    children:[
      {
        path: COMPONENT.HOME,
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: COMPONENT.CALENDER,
        loadChildren: () => import('../pages/calendar/calendar.module').then( m => m.CalendarPageModule)
      },
      {
        path: COMPONENT.MUSICIAN,
        loadChildren: () => import('../pages/musician/musician-list/musician-list.module').then( m => m.MusicianListPageModule)
      },
      {
        path: COMPONENT.MUSICIAN+'/:id',
        loadChildren: () => import('../pages/musician/musician-details/musician-details.module').then( m => m.MusicianDetailsPageModule)
      },
      {
        path: COMPONENT.INSTRUMENTS,
        loadChildren: () => import('../pages/musician/musician-list/musician-list.module').then( m => m.MusicianListPageModule)
      },
      {
        path: '',
        redirectTo: COMPONENT.MUSICIAN,
        pathMatch: 'full'
      },
    ]
  },
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsidePageRoutingModule {}
