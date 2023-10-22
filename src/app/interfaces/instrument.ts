export const TABLE_INSTRUMENTS='instruments';

export interface InstrumentType{
  id: number;
  label: string;
  label_short: string;
}
export interface Instrument {
  id: number;
  labelAddition?: string;
  serialNr?: string; // Made it optional as per the schema
  manufacturer?: string;
  constructionYear?: Date;
  acquisitionCost?: number;
  instrument_type: number;
  notes?: string;
  creatorId: string; // Changed to string because of UUID type in DB
  createdAt: Date;
  acquisitionDate?: Date;
  inventory_nr: number;
  distributor?: string;
  currency: number;
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
