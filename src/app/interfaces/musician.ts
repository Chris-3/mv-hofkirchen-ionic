export const TABLE_MUSICIANS='musicians';
export const BUCKET_AVATARS='avatars';


export interface Musician {
    id: number,
    first_name: string,
    last_name: string,
    tel_number?: number,
    street_address?: string,
    city?: string,
    postal_code?: number,
    creator_id: string,
    created_at: Date,
    linked_acc: string,
}