import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicianListPageRoutingModule } from './musician-list-routing.module';

import { MusicianListPage } from './musician-list.page';
// import { InsertMusicianDataComponent } from '../insert-musician-data/insert-musician-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicianListPageRoutingModule
  ],
  declarations: [
    MusicianListPage,
    // InsertMusicianDataComponent

  ]
})
export class MusicianListPageModule {}
