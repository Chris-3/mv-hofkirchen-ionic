import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {
    Instrument,
    InstrumentGermanLabels,

} from '../../../interfaces/instrument';
import {InsertUpdateInstrumentComponent} from '../insert-update-instrument/insert-update-instrument.component';
import {AlertCrtlService} from "../../../services/alert-crtl.service";
import {InstrumentService} from "../../../services/instrument.service";
import {Subscription} from "rxjs";
import {Loan} from "../../../interfaces/loan";
import {LoanRegistryComponent} from "../../loan-registry/loan-registry.component";
import {LoanService} from "../../../services/loan.service";
import {MusicianService} from "../../../services/musician.service";
import {Musician} from "../../../interfaces/musician";

@Component({
    selector: 'app-instruments-detail',
    templateUrl: './instruments-detail.page.html',
    styleUrls: ['./instruments-detail.page.scss'],
})
export class InstrumentsDetailPage implements OnInit {
    instrument: Instrument;
    loans: Loan[];
    private subInstrument: Subscription;
    private subLoans: Subscription;


    // currency: string;
    instrumentDetails = [
        {
            label: InstrumentGermanLabels.inventoryNr,
            prop: 'inventory_nr',
            format: () => this.formatInventoryLabel()
        },
        {label: InstrumentGermanLabels.serialNr, prop: 'serial_nr'},
        {label: InstrumentGermanLabels.manufacturer, prop: 'manufacturer'},
        {label: InstrumentGermanLabels.constructionYear, prop: 'construction_year'},
        {
            label: InstrumentGermanLabels.acquisitionCost,
            prop: 'acquisition_cost',
            format: () => this.formatAcquisitionCost()
        },
        {label: InstrumentGermanLabels.acquisitionDate, prop: 'acquisition_date'},
        {label: InstrumentGermanLabels.distributor, prop: 'distributor'},
        // {label: InstrumentGermanLabels.currency, prop: 'currency'},
        {label: InstrumentGermanLabels.container, prop: 'container'},
        {label: InstrumentGermanLabels.owner, prop: 'owner'},
        {label: InstrumentGermanLabels.particularities, prop: 'particularities'},
        {label: InstrumentGermanLabels.notes, prop: 'notes'},
    ];

    constructor(
        private activatedRoute: ActivatedRoute,
        private modalController: ModalController,
        private alertCtrl: AlertCrtlService,
        private instrumentService: InstrumentService,
        private loanService: LoanService,
        private musicianService: MusicianService,
    ) {
    }

    async ngOnInit() {
        await this.getInstrumentDetails().then(async () => {
            await this.getLoans();
        })
    }

    ngOnDestroy(): void {  // OnDestroy lifecycle hook
        if (this.subInstrument) {
            this.subInstrument.unsubscribe();
        }
        if (this.subLoans) {
            this.subLoans.unsubscribe();
        }
    }

    async getInstrumentDetails() {
        const id: string = this.activatedRoute.snapshot.paramMap.get('id');
        this.subInstrument = this.instrumentService.getByInventoryId(id).subscribe(async instrument => {
            if (instrument) {
                this.instrument = instrument;
            } else {
                await this.alertCtrl.presentErrorToast("Instrument konnte nicht gefunden werden!")
            }
        });
    }

    async getLoans() {
        this.subLoans = this.loanService.getLoansForInstrumentId(this.instrument.id).subscribe(async loans => {
            if (loans) {
                this.loans = loans;
            }
        });
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

            }
        });
        return await modal.present();
    }

    async openInsertUpdateLoanModal(loan?: Loan) {
        const modal = await this.modalController.create({
            component: LoanRegistryComponent,
            componentProps: {
                loan: loan,
                instrumentId: this.instrument.id,
            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {

            }
        });
        return await modal.present();
    }

    getFormattedValue(detail, instrument) {
        if (detail.format) {
            return detail.format(instrument[detail.prop]);
        }
        return instrument[detail.prop];
    }

    formatInventoryLabel(): string {
        return this.instrument.type_label_short + this.instrument.inventory_nr;
    }

    formatAcquisitionCost(): string {
        return this.instrument.acquisition_cost + this.instrument.currency_abbreviation;
    }

    async deleteInstrument(instrumentId: number) {
        const confirmation = await this.alertCtrl.presentConfirm(
            'Löschen bestätigen',
            'Möchten Sie dieses Instrument wirklich löschen?',
            'Abbrechen',
            'Löschen'
        );

        if (confirmation === 'ok') {
            await this.instrumentService.deleteInstrument(this.instrument.id);
        }
    }

    getMusicianNameFromId(musicianId: number) {
        let musician: Musician;
        this.musicianService.getMusicianById(musicianId).subscribe(async m => {
            musician = m;
        });
        return musician.first_name + ' ' + musician.last_name;
    }
}
