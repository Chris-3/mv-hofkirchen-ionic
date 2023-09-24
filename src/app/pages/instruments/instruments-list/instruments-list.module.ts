import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstrumentsListPageRoutingModule } from './instruments-list-routing.module';

import { InstrumentsListPage } from './instruments-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InstrumentsListPageRoutingModule
  ],
  declarations: [InstrumentsListPage]
})
export class InstrumentsListPageModule {}
