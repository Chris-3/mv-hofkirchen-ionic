
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicianDetailsPage } from './musician-details.page';

const routes: Routes = [
  {
    path: '',
    component: MusicianDetailsPage,
    children:[{
      path:'update',
      loadChildren: () => import('../insert-musician-data/insert-musician-data.component').then( m => m.InsertMusicianDataComponent)

    }]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    // InsertMusicianDataModalPageModule
  ],
  exports: [RouterModule],
  // declarations:[InsertMusicianDataModalPage]
})
export class MusicianDetailsPageRoutingModule {}
