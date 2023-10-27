import {Component, Input, numberAttribute, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {Loan} from "../../interfaces/loan";
import {LoanService} from "../../services/loan.service";
import {InstrumentService} from "../../services/instrument.service";
import {MusicianService} from "../../services/musician.service";
import {Instrument} from "../../interfaces/instrument";
import {Musician} from "../../interfaces/musician";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-loan-registry',
    templateUrl: './loan-registry.component.html',
    styleUrls: ['./loan-registry.component.scss'],
})
export class LoanRegistryComponent implements OnInit {
    @Input() loan: Loan;
    @Input() instrumentId?: number;
    @Input() musicianId?: number;
    @ViewChild('createForm') createForm: FormGroupDirective;

    showStartDatePicker = false;
    showEndDatePicker = false;
    instruments: Instrument[] = [];
    musicians: Musician[] = [];

    loanForm = this.fb.group({
        start_date: [new Date().toISOString(), Validators.required],
        end_date: [],
        instrument_id: [0, Validators.required],
        musician_id: [0, Validators.required]
    });
    public instrumentReturned: boolean;
    private subInstr: Subscription;
    private subMusician: Subscription;

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private loanService: LoanService,
        private instrumentService: InstrumentService,
        private musicianService: MusicianService,
    ) {
    }

    ngOnInit() {
        this.subInstr = this.instrumentService.instruments$.subscribe(data => {
            this.instruments = data;
        });

        this.subMusician = this.musicianService.musicians$.subscribe(data => {
            this.musicians = data;
        });
        if (this.loan && this.loan.id) {
            const loanData = {
                ...this.loan,
                start_date: new Date(this.loan.start_date).toISOString(),
                end_date: this.loan.end_date ? new Date(this.loan.end_date).toISOString() : null
            };

            this.loanForm.patchValue(loanData);
        }
        if (this.instrumentId) {
            this.loanForm.get('instrument_id').setValue(this.instrumentId);
        }

        if (this.musicianId) {
            this.loanForm.get('musician_id').setValue(this.musicianId);
        }
    }

    ngOnDestroy(): void {  // OnDestroy lifecycle hook
        if (this.subInstr) {
            this.subInstr.unsubscribe();
        }
        if (this.subMusician) {
            this.subMusician.unsubscribe();
        }
    }

    submitForm() {
        if (this.loan && this.loan.id) {
            this.updateLoan();
        } else {
            this.addNewLoan();
        }
    }

    async close() {
        this.ngOnDestroy();
        await this.modalController.dismiss();
    }

    setInstrumentStatus(returned: boolean) {
        this.instrumentReturned = returned;
        if (!returned) {
            this.loanForm.get('end_date').setValue(null);
        }
    }

    private async updateLoan() {
        const loanData = this.loanForm.value;
        this.loanService.updateLoan(loanData, this.loan.id).then(async response => {
                await this.modalController.dismiss(response);
            }
        )
    }

    private async addNewLoan() {
        const loanData = this.loanForm.value;
        this.loanService.addLoanEntry(loanData).then(async response => {
            await this.modalController.dismiss(response);
        })
    }
}
