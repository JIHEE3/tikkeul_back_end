export interface IMemberFileStorage {
  memberFileStorageId: number;
  originalName: string;
  name: string;
  path: string;
  isRemoved: 0 | 1;
  creator: number;
  createdDate?: Date;
  modifier: number;
  modifiedDate: Date;
}

export interface ICreateMemberFileStorage {
  originalName: string;
  name: string;
  path: string;
  creator: number;
  modifier: number;
}