import { Musician } from './../../../interfaces/musician';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-insert-musician-data',
  templateUrl: './insert-musician-data.component.html',
  styleUrls: ['./insert-musician-data.component.scss'],
})
export class InsertMusicianDataComponent {
  @Input() musician: Musician;

  constructor( private modalController: ModalController) {
    // componentProps can also be accessed at construction time using NavParams
    // console.log(this.navParams.get('website'));
  }

  // Sending data from Ionic modal to page
  settingIonic(version: string) {
    this.modalController.dismiss(
      { ionic: version },
      'confirm'
    );
  }

  closeModal() { this.modalController.dismiss(); }

  settingJavascript() { }

  // settingCommon(name: string) {
  //   this.modalController.dismiss(
  //     { name },
  //     'confirm'
  //   );
  //  }
}
