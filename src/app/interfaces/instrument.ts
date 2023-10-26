export const TABLE_INSTRUMENTS = 'instruments';
export const TABLE_INSTRUMENT_TYPES = "instrument_types";
export const TABLE_CURRENCIES = "currencies";

export interface InstrumentType {
  id: number;
  label: string;
  label_short: string;
}

export interface Currency {
  id: number;
  label: string;
  abbreviation: string;
}

export interface Instrument {
  id: number;
  label_addition?: string;
  serial_nr?: string; // Made it optional as per the schema
  manufacturer?: string;
  construction_year?: Date;
  acquisition_cost?: number;
  instrument_type_id: number;
  type_label?: string;
  type_label_short?: string;
  notes?: string;
  creator_id?: string; // Changed to string because of UUID type in DB
  created_at?: Date;
  acquisition_date?: Date;
  inventory_nr: number;
  distributor?: string;
  currency_id: number;
  currency_label?: string;
  currency_abbreviation?: string;
  container?: string;
  particularities?: string;
  owner: string;
}

export const InstrumentGermanLabels = {
  id: "ID",
  labelAddition: "Zusätzliche Bezeichnung",
  serialNr: "Seriennummer",
  manufacturer: "Hersteller",
  constructionYear: "Baujahr",
  acquisitionCost: "Anschaffungskosten",
  instrument_type: "Instrumententyp",
  notes: "Notizen",
  creatorId: "Ersteller-ID",
  createdAt: "Erstellt am",
  acquisitionDate: "Erwerbsdatum",
  inventoryNr: "Inventarnummer",
  distributor: "Händler",
  currency: "Währung",
  container: "Behälter",
  particularities: "Besonderheiten",
  owner: "Eigentümer"
};

