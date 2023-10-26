import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SupabaseService} from '../../../services/supabase.service';
import {Router} from '@angular/router';
import {Instrument, TABLE_INSTRUMENTS} from '../../../interfaces/instrument';
import {InsertUpdateInstrumentComponent} from '../insert-update-instrument/insert-update-instrument.component';
import {InstrumentService} from "../../../services/instrument.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-instruments-list',
    templateUrl: './instruments-list.page.html',
    styleUrls: ['./instruments-list.page.scss'],
})
export class InstrumentsListPage implements OnInit {
    instruments: Instrument[] = [];
    private subscription: Subscription;

    constructor(
        private modalController: ModalController,
        // private dataService: SupabaseService,
        // private router: Router,
        private instrumentService: InstrumentService,
    ) {
    }

    ngOnInit() {
        this.fetchInstruments();
    }

    ngOnDestroy(): void {  // OnDestroy lifecycle hook
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async fetchInstruments() {
        this.subscription = this.instrumentService.instruments$.subscribe(instruments => {
            this.instruments = instruments;
            // console.log(this.instruments);
        })
        // this.instruments = await this.dataService.getAllInstruments();
    }

    async fetchLabelsShort() {

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
