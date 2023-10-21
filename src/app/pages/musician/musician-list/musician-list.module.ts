import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicianListPageRoutingModule } from './musician-list-routing.module';

import { MusicianListPage } from './musician-list.page';
// import { InsertUpdateMusicianDataComponent } from '../insert-musician-data/insert-musician-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MusicianListPageRoutingModule
  ],
  declarations: [
    MusicianListPage,
    // InsertUpdateMusicianDataComponent

  ]
})
export class MusicianListPageModule {}
