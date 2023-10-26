import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SupabaseService} from '../../../services/supabase.service';
import {AlertCrtlService} from '../../../services/alert-crtl.service';
import {Instrument, InstrumentType, InstrumentGermanLabels, TABLE_INSTRUMENTS} from '../../../interfaces/instrument';
import {InstrumentService} from "../../../services/instrument.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-insert-update-instrument',
  templateUrl: './insert-update-instrument.component.html',
  styleUrls: ['./insert-update-instrument.component.scss'],
})
export class InsertUpdateInstrumentComponent implements OnInit {
  @Input() instrument: Instrument;
  @ViewChild('createForm') createForm: FormGroup;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  instrumentTypes: InstrumentType[] = [];
  currencies: any[] = [];
  inventoryLabel: string;
  private currencySubscription: Subscription;
  private instrTypesSubscription: Subscription;


  instrumentForm = this.fb.group({
    label_addition: [''],
    serial_nr: [''],
    manufacturer: [''],
    construction_year: [],
    acquisition_cost: [],
    instrument_type_id: [0, Validators.required],
    notes: [''],
    acquisition_date: [],
    inventory_nr: [1, Validators.required],
    distributor: [],
    currency_id: [1, Validators.required],
    container: [''],
    particularities: [''],
    owner: ['MV Hofkirchen',]
  });

  instrumentDetails = [
    {
      label: InstrumentGermanLabels.instrument_type,
      prop: 'instrument_type_id',
      type: 'dropdown',
      options: 'instrumentTypes'
    },
    {label: InstrumentGermanLabels.labelAddition, prop: 'label_addition', type: 'text'},
    {label: InstrumentGermanLabels.serialNr, prop: 'serial_nr', type: 'text'},
    {label: InstrumentGermanLabels.manufacturer, prop: 'manufacturer', type: 'text'},
    {label: InstrumentGermanLabels.constructionYear, prop: 'construction_year', type: 'date'},
    {label: InstrumentGermanLabels.acquisitionCost, prop: 'acquisition_cost', type: 'number'},
    {label: InstrumentGermanLabels.acquisitionDate, prop: 'acquisition_date', type: 'date'},
    {label: InstrumentGermanLabels.distributor, prop: 'distributor', type: 'text'},
    {label: InstrumentGermanLabels.currency, prop: 'currency_id', type: 'dropdown', options: 'currencies'},
    {label: InstrumentGermanLabels.container, prop: 'container', type: 'text'},
    {label: InstrumentGermanLabels.owner, prop: 'owner', type: 'text'},
    {label: InstrumentGermanLabels.particularities, prop: 'particularities', type: 'textarea'},
    {label: InstrumentGermanLabels.notes, prop: 'notes', type: 'textarea'},

  ];

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private instrumentService: InstrumentService,
  ) {
  }

  async ngOnInit() {
    await this.loadCurrencies();
    await this.loadInstrumentTypes();

    if (this.instrument && this.instrument.id) {
      this.instrumentForm.patchValue(this.instrument);
      this.inventoryLabel = this.instrument.type_label_short + this.instrument.inventory_nr;
    }
    this.instrumentForm.get('instrument_type_id').valueChanges.subscribe((value) => {
      // Create a mock event object to pass to the onInstrumentTypeChange method
      const mockEvent = {
        detail: {
          value: value
        }
      };
      this.onInstrumentTypeChange(mockEvent);
    });
  }

  ngOnDestroy(): void {  // OnDestroy lifecycle hook
    if (this.currencySubscription) {
      this.currencySubscription.unsubscribe();
    }
    if (this.instrTypesSubscription) {
      this.instrTypesSubscription.unsubscribe();
    }
  }

  async loadCurrencies() {
    this.currencySubscription = this.instrumentService.currencies$.subscribe(
      curr => {
        this.currencies = curr;
      }
    )
  }

  async loadInstrumentTypes() {
    this.instrTypesSubscription = this.instrumentService.instrumentTypes$.subscribe(
      instrTypes => {
        this.instrumentTypes = instrTypes;
      }
    )
  }

  submitForm() {
    if (this.instrument && this.instrument.id) {
      this.updateInstrument();
    } else {
      this.addNewInstrument();
    }
  }

  async onInstrumentTypeChange(event: any) {
    this.inventoryLabel = await this.instrumentService.getNextFreeInventoryNumberSlot(event.detail.value);
    if (this.instrument && this.inventoryLabel.includes(this.instrument.type_label_short)) {
      this.inventoryLabel = this.instrument.type_label_short + this.instrument.inventory_nr;
    }
    const inventoryNr = Number(this.inventoryLabel.slice(2));
    this.instrumentForm.get('inventory_nr').setValue(inventoryNr);

  }

  closeModal() {
    this.ngOnDestroy()
    this.modalController.dismiss();
  }


  async addNewInstrument() {
    const instrumentData = {...this.instrumentForm.value};
    this.instrumentService.addInstrument(instrumentData).then(async response => {
      await this.modalController.dismiss(response);
    })
  }

  async updateInstrument() {
    const instrumentData = {...this.instrumentForm.value};
    this.instrumentService.updateInstrument(instrumentData, this.instrument.id).then(async response => {
      await this.modalController.dismiss((response));
    })
  }

  getInstrumentOptions(field: any) {
    if (field.prop === 'instrument_type_id') {
      return this.instrumentTypes;
    } else if (field.prop === 'currency_id') {
      return this.currencies;
    }
    return [];
  }

  protected readonly InstrumentGermanLabels = InstrumentGermanLabels;
}
