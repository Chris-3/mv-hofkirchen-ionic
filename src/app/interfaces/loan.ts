export const TABLE_LOANS = "loan_register";

export interface Loan {
  id: number;
  created_at: Date;
  start_date: Date;
  end_date?: Date;
  instrument_id?: number;
  musician_id?: number;
}

export const LoanGermanLabels = {
  id: "ID",
  created_at: "Erstellt am",
  start_date: "Startdatum",
  end_date: "Enddatum",
  instrument_id: "Instrument-ID",
  musician_id: "Musiker-ID"
};
