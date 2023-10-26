import {Component, Input, numberAttribute, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {Loan, TABLE_LOANS} from "../../interfaces/loan";
import {AlertCrtlService} from "../../services/alert-crtl.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-loan-registry',
  templateUrl: './loan-registry.component.html',
  styleUrls: ['./loan-registry.component.scss'],
})
export class LoanRegistryComponent implements OnInit {
  @Input() loan: Loan;
  @ViewChild('createForm') createForm: FormGroupDirective;


  loanForm = this.fb.group({
    start_date: [new Date(), Validators.required],
    end_date: [],
    instrument_id: [0, Validators.required],
    musician_id: [0, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private dataService: SupabaseService,
    private alertCtrl: AlertCrtlService,
  ) {
  }

  ngOnInit() {

    if (this.loan && this.loan.id) {
      this.loanForm.patchValue(this.loan);
    }
  }

  submitForm() {
    if (this.loan && this.loan.id) {
      this.updateLoan();
    } else {
      this.addNewLoan();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  private async updateLoan() {
    const loanData = this.loanForm.value;
    this.dataService.updateDataOnTable(TABLE_LOANS, loanData, this.loan.id)
      .then(response=>{
        this.alertCtrl.presentToast("Leiheintrag erfolgreich erstellt!");
        this.modalCtrl.dismiss(response);
      })
      .catch(error=>{
        this.alertCtrl.presentErrorToast("Fehler beim erstellen des Leiheintrags");
        console.error("Error creating loan entry: ",error);
      })

  }

  private async addNewLoan() {
    const loanData = this.loanForm.value;
    this.dataService.addNewLineToTable(TABLE_LOANS, loanData)
      .then(response=>{
        this.alertCtrl.presentToast("Leiheintrag erfolgreich erstellt!");
        this.modalCtrl.dismiss(response);
      })
      .catch(error=>{
        this.alertCtrl.presentErrorToast("Fehler beim erstellen des Leiheintrags");
        console.error("Error creating loan entry: ",error);
      })
  }
}
