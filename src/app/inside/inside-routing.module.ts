import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';

import { InsidePage } from './inside.page';

const routes: Routes = [
  
  {
    path: '',
    component: InsidePage,
    children:[
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('../pages/calendar/calendar.module').then( m => m.CalendarPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
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
