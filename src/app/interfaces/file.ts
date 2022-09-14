
export const FILE_DB = 'files';

export interface MyFileInfo {
  private: boolean;
  title: string;
  file_name?: string;
}

export interface FileItem {
  created_at: string;
  file_name: string;
  id: string;
  image_url?: Promise<any>;
  private: boolean;
  title: string;
  user_id: string;
  creator?: boolean;
}