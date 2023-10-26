import {FormBuilder, Validators, FormGroupDirective, FormGroup} from '@angular/forms';
import {Musician, TABLE_MUSICIANS} from '../../../interfaces/musician';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {MusicianService} from "../../../services/musician.service";
import {InstrumentGermanLabels} from "../../../interfaces/instrument";

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
        private musicianService: MusicianService,
    ) {
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

    async closeModal() {
        await this.modalController.dismiss();
    }

    addNewMusician() {
        const musicianData = {...this.musicianForm.value};
        this.musicianService.addMusician(musicianData).then(async response => {
            await this.modalController.dismiss(response);
        });
    }

    updateMusician() {
        const musicianData = {...this.musicianForm.value};
        this.musicianService.updateMusician(musicianData, this.musician.id).then(async response => {
            await this.modalController.dismiss(response);
        });
    }


    deleteMusician() {
        this.musicianService.deleteMusician(this.musician.id).then(async response => {
            await this.modalController.dismiss(response);
        });
    }

    protected readonly InstrumentGermanLabels = InstrumentGermanLabels;
}
