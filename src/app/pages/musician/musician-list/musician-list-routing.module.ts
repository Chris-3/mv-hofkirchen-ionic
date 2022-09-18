import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicianListPage } from './musician-list.page';

const routes: Routes = [
  {
    path: '',
    component: MusicianListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicianListPageRoutingModule {}
