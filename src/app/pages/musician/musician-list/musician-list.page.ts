import {SupabaseService} from 'src/app/services/supabase.service';
import {Component, OnInit} from '@angular/core';
import {Musician, TABLE_MUSICIANS} from 'src/app/interfaces/musician';
import {ModalController} from '@ionic/angular';
import {InsertUpdateMusicianDataComponent} from '../insert-update-musician-data/insert-update-musician-data.component';
import {MusicianService} from "../../../services/musician.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-musician-list',
    templateUrl: './musician-list.page.html',
    styleUrls: ['./musician-list.page.scss'],
})
export class MusicianListPage implements OnInit {

    musicians: Musician[] = [];
    private subscription: Subscription;

    constructor(
        private modalController: ModalController,
        private musicianService: MusicianService,
    ) {
    }

    ngOnInit(): void {
        this.loadMusicians();
    }

    ngOnDestroy(): void {  // OnDestroy lifecycle hook
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async loadMusicians() {
        this.subscription = this.musicianService.musicians$.subscribe(musicians => {
            this.musicians = musicians;
        });
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
                // this.loadMusicians();
                // Handle the data returned from the modal
            }
        });

        return await modal.present();
    }

}
