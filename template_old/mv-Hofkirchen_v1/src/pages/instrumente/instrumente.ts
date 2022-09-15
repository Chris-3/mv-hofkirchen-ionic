import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InstrumentenDetailsPage } from '../instrumenten-details/instrumenten-details';

@Component({
  selector: 'page-instrumente',
  templateUrl: 'instrumente.html'
})
export class InstrumentePage {

  constructor(public navCtrl: NavController) {
  }
  goToInstrumentenDetails(params){
    if (!params) params = {};
    this.navCtrl.push(InstrumentenDetailsPage);
  }
}
