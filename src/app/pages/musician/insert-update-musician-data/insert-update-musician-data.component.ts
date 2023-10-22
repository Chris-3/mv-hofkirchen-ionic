import {AlertCrtlService} from '../../../services/alert-crtl.service';
import {SupabaseService} from '../../../services/supabase.service';
import {FormBuilder, Validators, FormGroupDirective} from '@angular/forms';
import {Musician, TABLE_MUSICIANS} from '../../../interfaces/musician';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-insert-musician-data',
    templateUrl: './insert-update-musician-data.component.html',
    styleUrls: ['./insert-update-musician-data.component.scss'],
})
export class InsertUpdateMusicianDataComponent implements OnInit {
    @Input() musician: Musician;
    @ViewChild('createForm') createForm: FormGroupDirective;


    musicianForm = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone: [''],
        street_address: [''],
        city: [''],
        postal_code: [],
        email: [''],
        is_extern: [false],
    });

    musicianDetails = [
        {label: 'First Name', prop: 'first_name', type: 'text'},
        {label: 'Last Name', prop: 'last_name', type: 'text'},
        {label: 'Phone', prop: 'phone', type: 'tel'},
        {label: 'Street Address', prop: 'street_address', type: 'text'},
        {label: 'City', prop: 'city', type: 'text'},
        {label: 'Postal Code', prop: 'postal_code', type: 'number'},
        {label: 'Email', prop: 'email', type: 'email'},
    ];

    constructor(
        private modalController: ModalController,
        private fb: FormBuilder,
        private dataService: SupabaseService,
        private alertCtrl: AlertCrtlService,
    ) {
        // componentProps can also be accessed at construction time using NavParams
        // console.log(this.navParams.get('website'));
    }

    ngOnInit() {
        if (this.musician && this.musician.id) { // Check for a valid musician object
            this.musicianForm.patchValue(this.musician); // Populate the form with the musician data
        }
    }


    submitForm() {
        if (this.musician && this.musician.id) {
            this.updateMusician();
        } else {
            this.addNewMusician();
        }
    }

    closeModal() {
        this.modalController.dismiss();
    }

    async presentToast(message: string) {
        const toast = await this.alertCtrl.presentToast(message);
    }

    async addNewMusician() {
        try {
            const musicianData = {...this.musicianForm.value};

            const response = await this.dataService.addNewLineToTable(TABLE_MUSICIANS, musicianData);
            this.presentToast('New musician created successfully!');
            this.modalController.dismiss(response);
        } catch (error) {
            this.presentToast('Error creating musician. Please try again.');
            console.error('Error creating musician:', error);
        }
    }

    async updateMusician() {
        try {
            const musicianData = {...this.musicianForm.value};

            const response = await this.dataService.updateDataOnTable(TABLE_MUSICIANS, musicianData, this.musician.id);
            this.presentToast('Musician updated successfully!');
            this.modalController.dismiss(response);
        } catch (error) {
            this.presentToast('Error updating musician. Please try again.');
            console.error('Error updating musician:', error);
        }
    }



    async deleteMusician() {
        this.alertCtrl.presentConfirm('confirm', 'confirm deletion', 'Cancel', 'OK').then(res => {
            if (res === 'ok') {
                this.dataService.deleteDataFromTable(TABLE_MUSICIANS, this.musician.id);
                // codes
            }
        });
    }



    filterEmptyFields(data: any): any {
        const fields: any = {};
        Object.keys(data).forEach(key => data[key] !== '' ? fields[key] = data[key] : key);

        return fields;
    }

}
