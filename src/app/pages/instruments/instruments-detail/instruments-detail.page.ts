import {Component, OnInit} from '@angular/core';
import {SupabaseService} from '../../../services/supabase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {
    Instrument,
    InstrumentGermanLabels,
    TABLE_INSTRUMENTS
} from '../../../interfaces/instrument';
import {InsertUpdateInstrumentComponent} from '../insert-update-instrument/insert-update-instrument.component';
import {AlertCrtlService} from "../../../services/alert-crtl.service";
import {COMPONENT} from "../../../interfaces/route-names";

@Component({
    selector: 'app-instruments-detail',
    templateUrl: './instruments-detail.page.html',
    styleUrls: ['./instruments-detail.page.scss'],
})
export class InstrumentsDetailPage implements OnInit {
    instrument: Instrument;
    currency: string;
    instrumentDetails = [
        {label: InstrumentGermanLabels.inventoryNr, prop: 'inventory_nr', format: () => this.formatInventoryLabel()},
        {label: InstrumentGermanLabels.serialNr, prop: 'serial_nr'},
        {label: InstrumentGermanLabels.manufacturer, prop: 'manufacturer'},
        {label: InstrumentGermanLabels.constructionYear, prop: 'construction_year'},
        {label: InstrumentGermanLabels.acquisitionCost, prop: 'acquisition_cost', format: () => this.formatAcquisitionCost()},
        {label: InstrumentGermanLabels.acquisitionDate, prop: 'acquisition_date'},
        {label: InstrumentGermanLabels.distributor, prop: 'distributor'},
        {label: InstrumentGermanLabels.currency, prop: 'currency'},
        {label: InstrumentGermanLabels.container, prop: 'container'},
        {label: InstrumentGermanLabels.owner, prop: 'owner'},
        {label: InstrumentGermanLabels.particularities, prop: 'particularities'},
        {label: InstrumentGermanLabels.notes, prop: 'notes'},
    ];

    constructor(
        private dataService: SupabaseService,
        private activatedRoute: ActivatedRoute,
        private modalController: ModalController,
        private alertCtrl: AlertCrtlService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        await this.checkAndFetchDataFromId();
        this.currency = await this.loadCurrency();
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
                this.checkAndFetchDataFromId();
                // Handle the data returned from the modal
            }
        });

        return await modal.present();
    }

    async checkAndFetchDataFromId() {
        // Get the 'id' parameter from the URL
        const id: string = this.activatedRoute.snapshot.paramMap.get('id');

        // Regular expression to match two uppercase letters followed by a number
        const pattern = /^[A-Z]{2}\d+$/;

        if (pattern.test(id)) {
            // Extract the letters and number from the ID
            const letters = id.substring(0, 2);
            const number = parseInt(id.substring(2));

            // Call the database service method with extracted values
            this.instrument = await this.dataService.getInstrumentByInventoryLabel(letters, number);

            // Handle the data or errors as needed
            console.log(this.instrument);
        } else {
            console.error('Invalid ID format');
        }
    }

    async loadCurrency(): Promise<string> {
        let currencies: any[] = [];
        await this.dataService.getDataFromTable("currencies")
            .then(response => {
                currencies = response;
            })
            .catch(error => {
                console.error('Error loading currencies:', error);
                this.alertCtrl.presentErrorToast("Fehler beim laden der Währungen!")
            });
        // Find the currency object that matches the id of this.instrument.currency
        const currencyObj = currencies.find(currency => currency.id === this.instrument.currency);

        // Return the content of the abbreviation column of the currency object
        return currencyObj ? currencyObj.abbreviation : '';
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
        return this.instrument.acquisition_cost + this.currency;
    }

    async deleteInstrument(instrumentId: number) {
        const confirmation = await this.alertCtrl.presentConfirm(
            'Löschen bestätigen',
            'Möchten Sie dieses Instrument wirklich löschen?',
            'Abbrechen',
            'Löschen'
        );

        if (confirmation === 'ok') {
            // Assuming you have a deleteInstrumentById method in your dataService
            await this.dataService.deleteDataFromTable(TABLE_INSTRUMENTS, instrumentId);
            await this.alertCtrl.presentToast("Instrument erfolgreich gelöscht!")
            await this.router.navigateByUrl('/' + COMPONENT.INSIDE + '/' + COMPONENT.INSTRUMENTS, {replaceUrl: true});
        }
    }
}
