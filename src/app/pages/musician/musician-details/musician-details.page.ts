import {InsertUpdateMusicianDataComponent} from '../insert-update-musician-data/insert-update-musician-data.component';
import {Musician, MusicianGermanLabels} from 'src/app/interfaces/musician';
import {ModalController} from '@ionic/angular';
import {SupabaseService} from 'src/app/services/supabase.service';
import {TABLE_MUSICIANS} from '../../../interfaces/musician';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {COMPONENT} from "../../../interfaces/route-names";
import {AlertCrtlService} from "../../../services/alert-crtl.service";

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

    constructor(
        private dataService: SupabaseService,
        private activatedRoute: ActivatedRoute,
        private modalController: ModalController,
        private alertCtrl: AlertCrtlService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');

        this.musician = await this.dataService.getDataDetails(TABLE_MUSICIANS, +id);
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
            // Assuming you have a deleteInstrumentById method in your dataService
            await this.dataService.deleteDataFromTable(TABLE_MUSICIANS, musicianId);
            await this.alertCtrl.presentToast("Musiker erfolgreich gelöscht!")
            await this.router.navigateByUrl('/' + COMPONENT.INSIDE + '/' + COMPONENT.MUSICIAN, {replaceUrl: true});
        }
    }

}
