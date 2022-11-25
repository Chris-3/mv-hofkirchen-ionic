import { InsertMusicianDataComponent } from './../insert-musician-data/insert-musician-data.component';
import { Musician } from 'src/app/interfaces/musician';
import { ModalController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { TABLE_MUSICIANS } from './../../../interfaces/musician';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-musician-details',
  templateUrl: './musician-details.page.html',
  styleUrls: ['./musician-details.page.scss'],
})
export class MusicianDetailsPage implements OnInit {

  public musician: Musician;

  // sub1: Subscription;

  constructor(
    private dataService: SupabaseService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private router: Router
  ) { }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.musician = await this.dataService.getDataDetails(TABLE_MUSICIANS, +id);
  }

  async updateMusician() {
    const modal = await this.modalController.create({
      component: InsertMusicianDataComponent,
      componentProps: { musician: this.musician },
      cssClass: 'setting-modal',
      backdropDismiss: false,
    });

    // const modal = await this.modalController.create(InsertMusicianDataModalPage,{});

    return await modal.present();
  }

}
