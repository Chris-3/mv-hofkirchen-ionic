import { AlertCrtlService } from './../../../services/alert-crtl.service';
import { SupabaseService } from './../../../services/supabase.service';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Musician, TABLE_MUSICIANS } from './../../../interfaces/musician';
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-insert-musician-data',
  templateUrl: './insert-update-musician-data.component.html',
  styleUrls: ['./insert-update-musician-data.component.scss'],
})
export class InsertUpdateMusicianDataComponent implements OnInit {
  @Input() musician: Musician;
  @ViewChild('createForm') createForm: FormGroupDirective;
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  selectedFile: File;
  includedFields: any;
  confirmDelete: boolean;
  avatarUrl: string;
  currentDate = new Date();

  musicianForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    streetAddress: [''],
    city: [''],
    postalCode: ['', Validators.pattern('[0-9]{0,6}')],
    email: [''],
    dateOfBirth: [null]
  });

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
      this.setAvatarUrl();
    }
  }
  // async ngOnInit() {
  //   // this.id = this.route.snapshot.paramMap.get('id');
  //   // if (this.id === "new") return;
  //   // if (this.musician.id<0) {
  //   //   // this.musician = await this.dataService.getDataDetails(TABLE_MUSICIANS, +this.musician.id);
  //   //   this.musicianForm.patchValue(this.musician);
  //   // }
  //   // this.fileService.loadFiles(this.images);
  //   console.log(this.musician);
  //   // this.musicianForm.patchValue(this.musician);
  //   // this.trackEmptyFields();
  // }
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
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
    }
  }
  async addNewMusician() {
    try {
      const avatarPath = await this.uploadAvatar();
      const musicianData = { ...this.musicianForm.value, avatar: avatarPath };

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
      const avatarPath = await this.uploadAvatar();
      const musicianData = { ...this.musicianForm.value, avatar: avatarPath };

      const response = await this.dataService.updateDataOnTable(TABLE_MUSICIANS, musicianData, this.musician.id);
      this.presentToast('Musician updated successfully!');
      this.modalController.dismiss(response);
    } catch (error) {
      this.presentToast('Error updating musician. Please try again.');
      console.error('Error updating musician:', error);
    }
  }
  async uploadAvatar() {
    if (!this.selectedFile) { return null; }

    const path = this.selectedFile.name;
    const result = await this.dataService.uploadToStorage(path, this.selectedFile);

    if (!result.Key) {
      console.error('Error uploading avatar: No Key returned');
      throw new Error('Error uploading avatar: No Key returned');
    }

    return result.Key;  // Return the Key (path) where the avatar is saved.
  }
  async deleteMusician() {
    this.alertCtrl.presentConfirm('confirm', 'confirm deletion', 'Cancel', 'OK').then(res => {
      if (res === 'ok') {
        this.dataService.deleteDataFromTable(TABLE_MUSICIANS, this.musician.id);
        // codes
      }
    });

    // await this.dataService.deleteDataFromTable(TABLE_MUSICIANS, this.musician.id);
    // this.presentToast('Musiker daten gelöscht!');

  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  trackEmptyFields(): void {
    this.musicianForm
      .valueChanges
      .pipe(map(this.filterEmptyFields))
      .subscribe(field => this.includedFields = field);
  }
  async setAvatarUrl(): Promise<void> {
    if (this.musician?.avatar) {
      const result = await this.dataService.getAvatarUrl(this.musician.avatar);
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
    return this?.avatarUrl || 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';
  }
// Filter any fields that aren't empty & store in a new object - To be passed on the Pipe map's caller
  filterEmptyFields(data: any): any  {
    const fields: any = {};
    Object.keys(data).forEach(key => data[key] !== '' ? fields[key] = data[key] : key);

    return fields;
  }

}
