import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SupabaseService} from '../../../services/supabase.service';
import {AlertCrtlService} from '../../../services/alert-crtl.service';
import {Instrument, TABLE_INSTRUMENTS} from '../../../interfaces/instrument';

@Component({
    selector: 'app-insert-update-instrument',
    templateUrl: './insert-update-instrument.component.html',
    styleUrls: ['./insert-update-instrument.component.scss'],
})
export class InsertUpdateInstrumentComponent implements OnInit {
    @Input() instrument: Instrument;
    @ViewChild('createForm') createForm: FormGroup;
    @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
    selectedFile: File;
    avatarUrl: string;
    pictureList: string[] = [];

    instrForm = this.fb.group({
        title: ['', Validators.required],
        serialNr: ['', Validators.required],
        manufacturer: [],
        constructionYear: [],
        acquisitionCost: [],
        instrumentType: [],
        isUsed: [],
        accessories: [],
        notes: []
    });

    constructor(
        private modalController: ModalController,
        private fb: FormBuilder,
        private dataService: SupabaseService,
        private alertCtrl: AlertCrtlService
    ) {
    }

    ngOnInit() {
        this.pictureList[0] = 'test.jpg';
        if (this.instrument && this.instrument.id) {
            this.instrForm.patchValue(this.instrument);
            this.setAvatarUrl();
        }
    }

    submitForm() {
        if (this.instrument && this.instrument.id) {
            this.updateInstrument();
        } else {
            this.addNewInstrument();
        }
    }

    closeModal() {
        this.modalController.dismiss();
    }

    async presentToast(message: string) {
        const toast = await this.alertCtrl.presentToast(message);
    }

    onFileChange(event: any) {
        if (event.target.files && event.target.files[0]) {
            this.selectedFile = event.target.files[0];
        }
    }

    async addNewInstrument() {
        console.log(this.instrForm.value);
        const avatarPathPromise = this.uploadAvatar();
        avatarPathPromise.then(avatarPath => {
            const instrumentData = {...this.instrForm.value};

            this.dataService.addNewLineToTable(TABLE_INSTRUMENTS, instrumentData)
                .then(response => {
                    this.presentToast('New instrument added successfully!');
                    this.modalController.dismiss(response);
                })
                .catch(error => {
                    this.presentToast('Error adding instrument. Please try again.');
                    console.error('Error adding instrument:', error);
                });
        }).catch(error => {
            this.presentToast('Error uploading avatar. Please try again.');
            console.error('Error uploading avatar:', error);
        });
    }
    logFormValue() {
        console.log(this.instrForm.value);
    }
    async updateInstrument() {
        const avatarPathPromise = this.uploadAvatar();
        avatarPathPromise.then(avatarPath => {
            const instrumentData = {...this.instrForm.value};

            this.dataService.updateDataOnTable(TABLE_INSTRUMENTS, instrumentData, this.instrument.id)
                .then(response => {
                    this.presentToast('Instrument updated successfully!');
                    this.modalController.dismiss(response);
                })
                .catch(error => {
                    this.presentToast('Error updating instrument. Please try again.');
                    console.error('Error updating instrument:', error);
                });
        }).catch(error => {
            this.presentToast('Error uploading avatar. Please try again.');
            console.error('Error uploading avatar:', error);
        });
    }

    async uploadAvatar() {
        if (!this.selectedFile) {
            return null;
        }

        const path = this.selectedFile.name;
        const result = await this.dataService.uploadToStorage(path, this.selectedFile);

        if (!result.Key) {
            console.error('Error uploading avatar: No Key returned');
            throw new Error('Error uploading avatar: No Key returned');
        }

        return result.Key;
    }

    triggerFileInput() {
        this.fileInput.nativeElement.click();
    }

    async setAvatarUrl(): Promise<void> {
        if (this.pictureList[0]) {
            const result = await this.dataService.getAvatarUrl(this.pictureList[0]);
            if (result?.data?.publicURL) {
                this.avatarUrl = result.data.publicURL;
            } else {
                this.avatarUrl = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';
            }
        } else {
            this.avatarUrl = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';
        }
    }

    getAvatar(): string {
        // return this?.avatarUrl || 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';
        return 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';

    }
}
