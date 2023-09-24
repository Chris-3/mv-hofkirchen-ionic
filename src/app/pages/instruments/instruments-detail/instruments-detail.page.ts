import {Component, OnInit} from '@angular/core';
import {SupabaseService} from '../../../services/supabase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {Instrument, TABLE_INSTRUMENTS} from '../../../interfaces/instrument';
import {InsertUpdateInstrumentComponent} from '../insert-update-instrument/insert-update-instrument.component';

@Component({
    selector: 'app-instruments-detail',
    templateUrl: './instruments-detail.page.html',
    styleUrls: ['./instruments-detail.page.scss'],
})
export class InstrumentsDetailPage implements OnInit {
    instrument: Instrument;

    constructor(
        private dataService: SupabaseService,
        private activatedRoute: ActivatedRoute,
        private modalController: ModalController,
        private router: Router
    ) {
    }

    async ngOnInit() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.instrument = await this.dataService.getDataDetails(TABLE_INSTRUMENTS, +id);
    }
    async openInsertUpdateInstrumentModal(instrument?: Instrument) {
        const modal = await this.modalController.create({
            component: InsertUpdateInstrumentComponent,
            componentProps: {
                instrument
            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {
                // Handle the data returned from the modal
            }
        });

        return await modal.present();
    }

}
