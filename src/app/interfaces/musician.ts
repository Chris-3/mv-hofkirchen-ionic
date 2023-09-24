export const TABLE_MUSICIANS='musicians';
export const BUCKET_AVATARS='avatars';


export interface Musician {
    id: number;
    firstName: string;
    lastName: string;
    phone?: string;
    streetAddress?: string;
    city?: string;
    postalCode?: string;
    creatorId: string;
    createdAt: Date;
    email?: string;
    avatar?: string;
    dateOfBirth?: Date;
}
