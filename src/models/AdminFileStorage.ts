export interface IAdminFileStorage {
  adminFileStorageId: number;
  originalName: string;
  name: string;
  path: string;
  isRemove: 0 | 1;
  creator: number;
  createdDate?: Date;
  modifier: number;
  modifiedDate: Date;
}

export interface ICreateAdminFileStorage {
  originalName: string;
  name: string;
  path: string;
  creator: number;
  modifier: number;
}