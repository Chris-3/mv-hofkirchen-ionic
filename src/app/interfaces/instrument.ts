export const TABLE_INSTRUMENTS='instruments';
export const BUCKET_INSTRUMENTS='instrPictures';


export interface Instrument {
    id: number;
    title: string;
    serialNr: string;
    manufacturer?: string;
    constructionYear?: string;
    acquisitionCost: number;
    instrumentType: number;
    isUsed: boolean;
    accessories: string;
    notes?: string;
    creatorId: number;
    createdAt: Date;
}
