import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstrumentsListPage } from './instruments-list.page';

const routes: Routes = [
  {
    path: '',
    component: InstrumentsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstrumentsListPageRoutingModule {}
