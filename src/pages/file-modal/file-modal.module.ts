import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FileModalPageRoutingModule } from './file-modal-routing.module';

import { FileModalPage } from './file-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileModalPageRoutingModule
  ],
  declarations: [FileModalPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class FileModalPageModule {}
