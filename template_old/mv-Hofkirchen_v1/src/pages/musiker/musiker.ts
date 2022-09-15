import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MusikerDetailsPage } from '../musiker-details/musiker-details';

@Component({
  selector: 'page-musiker',
  templateUrl: 'musiker.html'
})
export class MusikerPage {

  constructor(public navCtrl: NavController) {
  }
  goToMusikerDetails(params){
    if (!params) params = {};
    this.navCtrl.push(MusikerDetailsPage);
  }
}
