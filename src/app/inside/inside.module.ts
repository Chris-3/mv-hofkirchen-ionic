import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsidePageRoutingModule } from './inside-routing.module';

import { InsidePage } from './inside.page';
// import { InsertUpdateMusicianDataComponent } from '../pages/musician/insert-musician-data/insert-musician-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsidePageRoutingModule
  ],
  declarations: [
    InsidePage,
    // InsertUpdateMusicianDataComponent

  ]
})
export class InsidePageModule { }
