// import { InsertMusicianDataComponent } from '../insert-musician-data/insert-musician-data.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicianDetailsPageRoutingModule } from './musician-details-routing.module';

import { MusicianDetailsPage } from './musician-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MusicianDetailsPageRoutingModule
  ],
  declarations: [
    MusicianDetailsPage,
  ]
})
export class MusicianDetailsPageModule {}
