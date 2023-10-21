
export const FILE_DB = 'files';

export interface MyFileInfo {
  private: boolean;
  title: string;
  fileName?: string;
}

export interface FileItem {
  createdAt: string;
  fileName: string;
  id: string;
  imageUrl?: Promise<any>;
  private: boolean;
  title: string;
  userId: string;
  creator?: boolean;
}
