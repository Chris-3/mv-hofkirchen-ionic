import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Loan, TABLE_LOANS} from "../interfaces/loan";
import {SupabaseService} from "./supabase.service";
import {AlertCrtlService} from "./alert-crtl.service";

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private loans: BehaviorSubject<Loan[]> = new BehaviorSubject<Loan[]>([]);

  get loans$() {
    return this.loans.asObservable();
  }

  constructor(
    private supabaseService: SupabaseService,
    private alertService: AlertCrtlService
  ) {
    this.fetchLoans();
  }

  private async fetchLoans() {
    this.supabaseService.getDataFromTable(TABLE_LOANS)
      .then(response => {
        this.loans.next(response);
      }).catch(
      error => {
        console.error('Error fetching loans:', error);
      }
    )
  }

  async addLoanEntry(newLoan:Loan): Promise<any> {
    await this.supabaseService.addNewLineToTable(TABLE_LOANS, newLoan)
      .then(response => {
        this.fetchLoans();
        this.alertService.presentToast('Loan entry created successfully!');
      })
      .catch(error => {
        this.alertService.presentErrorToast('Error creating loan entry. Please try again.');
        console.error('Error adding loan:', error);
      });
  }
  async updateLoan(updatedLoan: Loan) {
    await this.supabaseService.updateDataOnTable(TABLE_LOANS, updatedLoan, updatedLoan.id)
      .then(
        response=>{
          this.fetchLoans();
          this.alertService.presentToast('Loan entry created successfully!');
        }
      ).catch(
        error=>{
          this.alertService.presentErrorToast('Error updating loan. Please try again.');
          console.error('Error updating loan:', error);
        }
      )
  }
  async deleteLoan(loanId: number) {
    await this.supabaseService.deleteDataFromTable(TABLE_LOANS, loanId)
      .then(response=>{
        this.fetchLoans();
        this.alertService.presentToast('Loan deleted successfully!');
      }).catch(
        error=>{
          this.alertService.presentErrorToast('Error deleting loan. Please try again.');
          console.error('Error deleting loan:', error);
        }
      )
  }
}
