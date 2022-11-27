import { COMPONENT } from './../../../interfaces/route-names';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Musician, TABLE_MUSICIANS } from 'src/app/interfaces/musician';
import { ModalController } from '@ionic/angular';
import { InsertMusicianDataComponent } from '../insert-musician-data/insert-musician-data.component';

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

  async newMusician() {
    // this.router.navigateByUrl('/' + COMPONENT.INSIDE + '/' + COMPONENT.MUSICIAN + '/new');

    const modal = await this.modalController.create({
      component: InsertMusicianDataComponent,
      componentProps: {
        musician: {
          "id": 9,
          "first_name": "Hallo",
          "last_name": "Du",
          "phone": "1234",
          "street_address": "Regnersdorf",
          "creator_id": "2e94b1fb-91c7-4723-ac66-cb60a239ca4b",
          "created_at": "2022-09-13T22:07:19.51196+00:00",
          "referenced_user": null,
          "city": "hofkirchen",
          "postal_code": 4716,
          "email": null
      }
      },
      cssClass: 'setting-modal',
      backdropDismiss: false,
    });

    // const modal = await this.modalController.create(InsertMusicianDataModalPage,{});

    return await modal.present();


  }
}
