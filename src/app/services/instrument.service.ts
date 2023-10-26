import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from "rxjs";
import {
  Currency,
  Instrument,
  InstrumentType, TABLE_CURRENCIES,
  TABLE_INSTRUMENT_TYPES,
  TABLE_INSTRUMENTS
} from "../interfaces/instrument";
import {SupabaseService} from "./supabase.service";
import {AlertCrtlService} from "./alert-crtl.service";
import {Router} from "@angular/router";
import {filter, map} from "rxjs/operators";
import {COMPONENT} from "../interfaces/route-names";

@Injectable({
  providedIn: 'root'
})
export class InstrumentService {
  private instruments: BehaviorSubject<Instrument[]> = new BehaviorSubject<Instrument[]>([]);
  private instrumentTypes: BehaviorSubject<InstrumentType[]> = new BehaviorSubject<InstrumentType[]>([]);
  private currencies: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>([]);

  get instruments$() {
    return this.instruments.asObservable();
  }

  public readonly instrumentTypes$ = this.instrumentTypes.asObservable();
  public readonly currencies$ = this.currencies.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private alertService: AlertCrtlService,
    private router: Router,
  ) {
    this.initializeData();
  }
  private async initializeData() {
    try {
      await Promise.all([
        this.fetchInstrumentTypes(),
        this.fetchCurrencies(),
      ])
      await this.fetchInstruments();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  private async fetchInstruments() {
    this.supabaseService.getAllInstruments()
      .then(response => {
        // const enhancedInstruments = this.enhanceInstrumentsWithDetails(response);
        this.instruments.next(response);
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Instrumente:', error);
      });
  }

  private async fetchInstrumentTypes() {
    this.supabaseService.getDataFromTable(TABLE_INSTRUMENT_TYPES)
      .then(response => {
        this.instrumentTypes.next(response);
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Instrumententypen:', error);
      });
  }

  private async fetchCurrencies() {
    this.supabaseService.getDataFromTable(TABLE_CURRENCIES)
      .then(response => {
        this.currencies.next(response);
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Währungen:', error);
      });
  }

  private enhanceInstrumentsWithDetails(instruments: Instrument[]): Instrument[] {
    return instruments.map(instrument => ({
      ...instrument,
      instrument_type: this.instrumentTypes.getValue().find(type => type.id === instrument.instrument_type_id),
      currency: this.currencies.getValue().find(curr => curr.id === instrument.currency_id)
    }));
  }
  getInstrumentById(id: number) {
    return this.instruments$.pipe(
      filter(instruments => !!instruments.length),  // Ensure the array isn't empty
      map(instruments => instruments.find(instrument => instrument.id === id))
    );
  }

  getByInventoryId(inventoryId: string) {
    // Regular expression to match two uppercase letters followed by a number
    const pattern = /^[A-Z]{2}\d+$/;

    if (pattern.test(inventoryId)) {
      // Extract the letters and number from the inventoryId
      const letters = inventoryId.substring(0, 2);
      const number = parseInt(inventoryId.substring(2));

      // Return an observable of the matching instrument
      return this.instruments$.pipe(
        map(instruments =>
          instruments.find(instrument =>
            instrument.type_label_short === letters && instrument.inventory_nr === number
          )
        )
      );
    } else {
      console.error('Invalid Inventory ID format');
      return of(null);  // Return an observable of null
    }
  }

  async addInstrument(newInstrument): Promise<any> {
    await this.supabaseService.addNewLineToTable(TABLE_INSTRUMENTS, newInstrument)
      .then(response => {
        this.fetchInstruments();
        this.alertService.presentToast('Instrument erfolgreich erstellt!');
      })
      .catch(error => {
        this.alertService.presentErrorToast('Fehler beim Erstellen des Instruments. Bitte versuchen Sie es erneut.');
        console.error('Fehler beim Hinzufügen des Instruments:', error);
      });
  }

  async updateInstrument(updatedInstrument, instrumentId: number) {
    await this.supabaseService.updateDataOnTable(TABLE_INSTRUMENTS, updatedInstrument, instrumentId)
      .then(response => {
        this.fetchInstruments();
        this.alertService.presentToast('Instrument erfolgreich aktualisiert!');
      })
      .catch(error => {
        this.alertService.presentErrorToast('Fehler beim Aktualisieren des Instruments. Bitte versuchen Sie es erneut.');
        console.error('Fehler beim Aktualisieren des Instruments:', error);
      });
  }

  async deleteInstrument(instrumentId: number) {
    await this.supabaseService.deleteDataFromTable(TABLE_INSTRUMENTS, instrumentId)
      .then(response => {
        this.fetchInstruments();
        this.alertService.presentToast('Instrument erfolgreich gelöscht!');
        // Redirect to the instruments page after deletion
        this.router.navigateByUrl('/' + COMPONENT.INSIDE + '/' + COMPONENT.INSTRUMENTS, {replaceUrl: true});
      })
      .catch(error => {
        this.alertService.presentErrorToast('Fehler beim Löschen des Instruments. Bitte versuchen Sie es erneut.');
        console.error('Fehler beim Löschen des Instruments:', error);
      });
  }

  getNextFreeInventoryNumberSlot(instrumentTypeId: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const selectedType = this.instrumentTypes.getValue().find(instrumentType => instrumentType.id === instrumentTypeId);

      if (!selectedType) {
        reject('Instrument type not found');
        return;
      }

      const matchingInstruments = this.instruments.getValue().filter(instr => instr.type_label_short === selectedType.label_short);

      // If there are no instruments of this type yet, assign the first number
      if (matchingInstruments.length === 0) {
        resolve(`${selectedType.label_short}1`);
        return;
      }

      // Extract all the inventory numbers for the matching instruments and sort them
      const sortedInventoryNrs = matchingInstruments.map(instr => instr.inventory_nr).sort((a, b) => a - b);

      let nextInventoryNr = 1;

      // Find the first missing number in the sequence
      for (let i = 0; i < sortedInventoryNrs.length; i++) {
        if (sortedInventoryNrs[i] !== nextInventoryNr) {
          break;  // 'nextInventoryNr' is the first missing number
        }
        nextInventoryNr++;
      }

      resolve(`${selectedType.label_short}${nextInventoryNr}`);
    });
  }
}
