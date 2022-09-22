export const TABLE_MUSICIANS='musicians';
export const BUCKET_AVATARS='avatars';


export interface Musician {
    id: number,
    first_name: string,
    last_name: string,
    phone?: string,
    street_address?: string,
    city?: string,
    postal_code?: string,
    creator_id: string,
    created_at: Date,
    email?: string,
}