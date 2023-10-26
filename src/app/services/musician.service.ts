import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Musician, TABLE_MUSICIANS} from "../interfaces/musician";
import {SupabaseService} from "./supabase.service";
import {AlertCrtlService} from "./alert-crtl.service";
import {COMPONENT} from "../interfaces/route-names";
import {Router} from "@angular/router";
import {filter, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MusicianService {
  private musicians: BehaviorSubject<Musician[]> = new BehaviorSubject<Musician[]>([]);

  get musicians$() {
    return this.musicians.asObservable();
  }

  constructor(
    private supabaseService: SupabaseService,
    private alertService: AlertCrtlService,
    private router: Router,
  ) {
    this.fetchMusicians();
  }

  private async fetchMusicians() {
    this.supabaseService.getDataFromTable(TABLE_MUSICIANS)
      .then(response => {
        this.musicians.next(response);
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Musiker:', error);
      });
  }

  getMusicianById(id: number) {
    return this.musicians$.pipe(
      filter(musicians => !!musicians.length),  // Ensure the array isn't empty
      map(musicians => musicians.find(musician => musician.id === id))
    );
  }

  async addMusician(newMusician): Promise<any> {
    await this.supabaseService.addNewLineToTable(TABLE_MUSICIANS, newMusician)
      .then(response => {
        this.fetchMusicians();
        this.alertService.presentToast('Musiker erfolgreich erstellt!');
      })
      .catch(error => {
        this.alertService.presentErrorToast('Fehler beim Erstellen des Musikers. Bitte versuchen Sie es erneut.');
        console.error('Fehler beim Hinzufügen des Musikers:', error);
      });
  }

  async updateMusician(updatedMusician, musicianId: number) {
    await this.supabaseService.updateDataOnTable(TABLE_MUSICIANS, updatedMusician, musicianId)
      .then(response => {
        this.fetchMusicians();
        this.alertService.presentToast('Musiker erfolgreich aktualisiert!');
      })
      .catch(error => {
        this.alertService.presentErrorToast('Fehler beim Aktualisieren des Musikers. Bitte versuchen Sie es erneut.');
        console.error('Fehler beim Aktualisieren des Musikers:', error);
      });
  }

  async deleteMusician(musicianId: number) {
    await this.supabaseService.deleteDataFromTable(TABLE_MUSICIANS, musicianId)
      .then(response => {
        this.fetchMusicians();
        this.alertService.presentToast('Musiker erfolgreich gelöscht!');
        this.router.navigateByUrl('/' + COMPONENT.INSIDE + '/' + COMPONENT.MUSICIAN, {replaceUrl: true});
      })
      .catch(error => {
        this.alertService.presentErrorToast('Fehler beim Löschen des Musikers. Bitte versuchen Sie es erneut.');
        console.error('Fehler beim Löschen des Musikers:', error);
      });
  }
}
