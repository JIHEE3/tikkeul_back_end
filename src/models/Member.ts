export interface IMember {
  [x: string]: any;
  readonly memberId: number;
  id: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: 'N' | 'M' | 'F';
  phoneNumber: string;
  avatar?: number;
  status: number;
  createdDate: Date;
  modifiedDate: Date;
  modifier: number;
}

export interface IUpdateMemberAvatar {
  readonly memberId: number;
  avatar: number;
  modifier: number;
}