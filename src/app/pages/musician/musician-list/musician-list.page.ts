import { COMPONENT } from './../../../interfaces/route-names';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Musician, TABLE_MUSICIANS } from 'src/app/interfaces/musician';
import { ModalController } from '@ionic/angular';
import { InsertUpdateMusicianDataComponent } from '../insert-update-musician-data/insert-update-musician-data.component';

@Component({
  selector: 'app-musician-list',
  templateUrl: './musician-list.page.html',
  styleUrls: ['./musician-list.page.scss'],
})
export class MusicianListPage implements OnInit {

  musicians: Musician[] = [];
  constructor(
    private modalController: ModalController,
    private dataService: SupabaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMusicians();
  }

  async loadMusicians() {
    this.musicians = await this.dataService.getDataFromTable(TABLE_MUSICIANS);
  }

  async openModal(musician?: Musician) {
    const modal = await this.modalController.create({
      component: InsertUpdateMusicianDataComponent,
      componentProps: {
        musician
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.loadMusicians();
        // Handle the data returned from the modal
      }
    });

    return await modal.present();
  }
}
