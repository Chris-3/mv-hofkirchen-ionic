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
import {InstrumentService} from "../../../services/instrument.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-instruments-detail',
  templateUrl: './instruments-detail.page.html',
  styleUrls: ['./instruments-detail.page.scss'],
})
export class InstrumentsDetailPage implements OnInit {
  instrument: Instrument;
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
  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private alertCtrl: AlertCrtlService,
    private instrumentService: InstrumentService,
  ) {
  }

  async ngOnInit() {
    await this.getInstrumentDetails();
  }

  ngOnDestroy(): void {  // OnDestroy lifecycle hook
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async getInstrumentDetails() {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscription = this.instrumentService.getByInventoryId(id).subscribe(async instrument => {
      if (instrument) {
        this.instrument = instrument;
      } else {
        await this.alertCtrl.presentErrorToast("Instrument konnte nicht gefunden werden!")
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
        this.getInstrumentDetails();
        // Handle the data returned from the modal
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
}
