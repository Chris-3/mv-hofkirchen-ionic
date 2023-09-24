import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstrumentsDetailPageRoutingModule } from './instruments-detail-routing.module';

import { InstrumentsDetailPage } from './instruments-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InstrumentsDetailPageRoutingModule
  ],
  declarations: [InstrumentsDetailPage]
})
export class InstrumentsDetailPageModule {}
