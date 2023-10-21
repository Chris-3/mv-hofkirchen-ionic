import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SupabaseService} from '../../../services/supabase.service';
import {Router} from '@angular/router';
import {Instrument, TABLE_INSTRUMENTS} from '../../../interfaces/instrument';
import {InsertUpdateInstrumentComponent} from '../insert-update-instrument/insert-update-instrument.component';

@Component({
    selector: 'app-instruments-list',
    templateUrl: './instruments-list.page.html',
    styleUrls: ['./instruments-list.page.scss'],
})
export class InstrumentsListPage implements OnInit {
    instruments: Instrument[] = [];

    constructor(
        private modalController: ModalController,
        private dataService: SupabaseService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.fetchInstruments();
    }

    async fetchInstruments() {
        this.instruments = await this.dataService.getDataFromTable(TABLE_INSTRUMENTS);
    }

    async openInsertUpdateInstrumentModal(instrument?: Instrument) {
        const modal = await this.modalController.create(
            {
                component: InsertUpdateInstrumentComponent,
                componentProps: {
                    instrument
                }
            });
        modal.onDidDismiss()
            .then((dataReturned) => {
                if (dataReturned !== null) {
                    this.fetchInstruments();
                    // Handle the data returned from the modal
                }
            });

        return await modal.present();
    }

}
