import { AlertCrtlService } from './../../../services/alert-crtl.service';
import { SupabaseService } from './../../../services/supabase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Musician, TABLE_MUSICIANS } from './../../../interfaces/musician';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-insert-musician-data',
  templateUrl: './insert-musician-data.component.html',
  styleUrls: ['./insert-musician-data.component.scss'],
})
export class InsertMusicianDataComponent implements OnInit {
  @Input() musician: Musician;

  includedFields: any;
  confirmDelete: Boolean;

  musicianForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    phone: [''],
    street_address: [''],
    city: [''],
    postal_code: ['', Validators.pattern("[0-9]{0,6}")],
    email: [''],
  })

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private dataService: SupabaseService,
    private alertCtrl: AlertCrtlService,

  ) {
    // componentProps can also be accessed at construction time using NavParams
    // console.log(this.navParams.get('website'));
  }


  async ngOnInit() {
    // this.id = this.route.snapshot.paramMap.get('id');
    // if (this.id === "new") return;
    // if (this.musician.id<0) {
    //   // this.musician = await this.dataService.getDataDetails(TABLE_MUSICIANS, +this.musician.id);
    //   this.musicianForm.patchValue(this.musician);
    // }
    // this.fileService.loadFiles(this.images);
    this.musicianForm.patchValue(this.musician);
    this.trackEmptyFields();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  addNewMusican() {
    this.dataService.addNewLineToTable(TABLE_MUSICIANS, this.includedFields);

    // this.router.navigateByUrl('/Home/Musiker', { replaceUrl: true })
    //   .then(() => this.toaster.success('Neuer Musiker angelegt'));
  }

  async updateMusician() {

    if (this.musician.id < 0) { this.addNewMusican(); }
    else {
      await this.dataService.updateDataOnTable(TABLE_MUSICIANS, this.musicianForm.value, this.musician.id);
      // this.presentToast('Musiker Daten gespeichert!');
    }
    this.modalController.dismiss().then(() => {
      this.alertCtrl.presentToast('Musiker Daten gespeichert!')
    });

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

  trackEmptyFields(): void {
    this.musicianForm
      .valueChanges
      .pipe(map(this.filterEmptyFields))
      .subscribe(field => this.includedFields = field);
  }

  filterEmptyFields(data: any): any {    // Filter any fields that aren't empty & store in a new object - To be passed on the Pipe map's caller
    let fields: any = {};
    Object.keys(data).forEach(key => data[key] != '' ? fields[key] = data[key] : key);

    return fields;
  }

}
