export const TABLE_MUSICIANS = 'musicians';
export const BUCKET_AVATARS = 'avatars';


export interface Musician {
    id: number;
    first_name: string;
    last_name: string;
    phone?: string;
    street_address?: string;
    city?: string;
    postal_code?: number;
    creator_id?: string;
    created_at?: Date;
    email?: string;
    notes?: string;
    is_extern: boolean;
}

export const MusicianGermanLabels = {
    id: "ID",
    firstName: "Vorname",
    lastName: "Nachname",
    phone: "Telefon",
    streetAddress: "Straßenadresse",
    city: "Stadt",
    postalCode: "Postleitzahl",
    creatorId: "Ersteller-ID",
    createdAt: "Erstellt am",
    email: "E-Mail",
    notes: "Notizen",
    isExtern: "Extern",
};
