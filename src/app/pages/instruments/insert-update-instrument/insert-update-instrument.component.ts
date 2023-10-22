import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SupabaseService} from '../../../services/supabase.service';
import {AlertCrtlService} from '../../../services/alert-crtl.service';
import {Instrument, InstrumentType, InstrumentGermanLabels, TABLE_INSTRUMENTS} from '../../../interfaces/instrument';

@Component({
  selector: 'app-insert-update-instrument',
  templateUrl: './insert-update-instrument.component.html',
  styleUrls: ['./insert-update-instrument.component.scss'],
})
export class InsertUpdateInstrumentComponent implements OnInit {
  @Input() instrument: Instrument;
  @ViewChild('createForm') createForm: FormGroup;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  pictureList: string[] = [];
  instrumentTypes: InstrumentType[] = [];
  currencies: any[] = [];
  inventoryLabel: string;


  instrForm = this.fb.group({
    label_addition: [''],
    serial_nr: [''],
    manufacturer: [''],
    construction_year: [],
    acquisition_cost: [],
    instrument_type: [0, Validators.required],
    notes: [''],
    acquisition_date: [],
    inventory_nr: [1, Validators.required], // Made required based on the DB constraint
    distributor: [],
    currency: [1, Validators.required], // Made required based on the DB constraint
    container: [''],
    particularities: [''],
    owner: ['MV Hofkirchen',] // Made required based on the DB constraint
  });

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private dataService: SupabaseService,
    private alertCtrl: AlertCrtlService
  ) {
  }

  ngOnInit() {
    this.loadCurrencies();
    this.loadInstrumentTypes();

    this.pictureList[0] = 'test.jpg';
    if (this.instrument && this.instrument.id) {
      this.instrForm.patchValue(this.instrument);
      this.inventoryLabel=this.instrument.type_label_short+this.instrument.inventory_nr;
    }
  }

  async loadCurrencies() {
    await this.dataService.getDataFromTable("currencies")
      .then(response => {
        this.currencies = response;
      })
      .catch(error => {
        console.error('Error loading currencies:', error);
        this.alertCtrl.presentErrorToast("Fehler beim laden der Währungen!")
      });
  }

  async loadInstrumentTypes() {
    await this.dataService.getDataFromTable("instrument_types ")
      .then(response => {
        this.instrumentTypes = response;
      })
      .catch(error => {
        console.error('Error loading instrument types:', error);
        this.alertCtrl.presentErrorToast("Fehler beim laden der Instrument Typen!")
      });
  }

  submitForm() {
    if (this.instrument && this.instrument.id) {
      this.updateInstrument();
    } else {
      this.addNewInstrument();
    }
  }

  async onInstrumentTypeChange(event: any) {
    const selectedType = this.instrumentTypes.find(instrumentType => instrumentType.id === event.detail.value);

    this.dataService.getNextFreeInventoryNumber(selectedType.label_short)
      .then(response => {
        this.inventoryLabel = "" + selectedType.label_short + response;
        this.instrForm.value.inventory_nr = response;
      })
      .catch(error => {
        console.error('Error loading inventory number types:', error);
        this.alertCtrl.presentErrorToast("Fehler beim laden der neuen Inventur Nr!")
      });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async presentToast(message: string) {
    await this.alertCtrl.presentToast(message);
  }

  async addNewInstrument() {
    const instrumentData = {...this.instrForm.value};
    this.dataService.addNewLineToTable(TABLE_INSTRUMENTS, instrumentData)
      .then(response => {
        this.alertCtrl.presentToast("Neues Instrument erfolgreich erstellt!")
        this.modalController.dismiss(response);
      })
      .catch(error => {
        this.alertCtrl.presentErrorToast("Fehler beim erstellen des Instruments!")
        console.error('Error adding instrument:', error);
      });
  }

  async updateInstrument() {
    const instrumentData = {...this.instrForm.value};
    this.dataService.updateDataOnTable(TABLE_INSTRUMENTS, instrumentData, this.instrument.id)
      .then(response => {
        this.alertCtrl.presentToast("Instrument Daten erfolgreich geändert!")
        this.modalController.dismiss(response);
      })
      .catch(error => {
        this.alertCtrl.presentErrorToast("Fehler beim ändern der Instrument Daten!")
        console.error('Error updating instrument:', error);
      });
  }

  getAvatar(): string {
    // return this?.avatarUrl || 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';
    return 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';

  }


  protected readonly InstrumentGermanLabels = InstrumentGermanLabels;
}
