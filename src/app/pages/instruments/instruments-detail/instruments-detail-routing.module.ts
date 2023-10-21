import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstrumentsDetailPage } from './instruments-detail.page';

const routes: Routes = [
  {
    path: '',
    component: InstrumentsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstrumentsDetailPageRoutingModule {}
