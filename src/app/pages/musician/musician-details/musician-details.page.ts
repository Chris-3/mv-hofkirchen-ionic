import {InsertUpdateMusicianDataComponent} from '../insert-update-musician-data/insert-update-musician-data.component';
import {Musician, MusicianGermanLabels} from 'src/app/interfaces/musician';
import {ModalController} from '@ionic/angular';
import {SupabaseService} from 'src/app/services/supabase.service';
import {TABLE_MUSICIANS} from '../../../interfaces/musician';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {COMPONENT} from "../../../interfaces/route-names";
import {AlertCrtlService} from "../../../services/alert-crtl.service";
import {MusicianService} from "../../../services/musician.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-musician-details',
    templateUrl: './musician-details.page.html',
    styleUrls: ['./musician-details.page.scss'],
})
export class MusicianDetailsPage implements OnInit {

    public musician: Musician;

    musiciansDetails = [
        {label: MusicianGermanLabels.firstName, prop: 'first_name'},
        {label: MusicianGermanLabels.lastName, prop: 'last_name'},
        {label: MusicianGermanLabels.phone, prop: 'phone'},
        {label: MusicianGermanLabels.city, prop: 'city', format: () => this.formatStreetAddress()},
        {label: MusicianGermanLabels.streetAddress, prop: 'street_address'},
        {label: MusicianGermanLabels.email, prop: 'email'},
        {label: MusicianGermanLabels.notes, prop: 'notes'},
    ];
    private subscription: Subscription;

    constructor(
        private musicianService: MusicianService,
        private activatedRoute: ActivatedRoute,
        private modalController: ModalController,
        private alertCtrl: AlertCrtlService,
    ) {
    }

     ngOnInit() {
        const id = +this.activatedRoute.snapshot.paramMap.get('id');
        this.subscription = this.musicianService.getMusicianById(id).subscribe(musician => {
            this.musician = musician;
        });
    }

    ngOnDestroy(): void {  // OnDestroy lifecycle hook
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
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

    formatStreetAddress(): string {
        return this.musician.postal_code + ' ' + this.musician.city;
    }

    async deleteMusician(musicianId: number) {
        const confirmation = await this.alertCtrl.presentConfirm(
            'Löschen bestätigen',
            'Möchten Sie diesen Musiker wirklich löschen?',
            'Abbrechen',
            'Löschen'
        );
        if (confirmation === 'ok') {
            await this.musicianService.deleteMusician(musicianId);
        }
    }

}
