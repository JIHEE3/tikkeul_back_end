export interface IUser {
  memberId: number;
  userId: string;
  password: string;
  salt: string;
  email: string;
  userName: string;
  createdDate: Date;
  modifiedDate: Date;
  primaryColorId?: number;
  secondaryColorId?: number;
}


// 성별 컬럼 m, f, n 이렇게만 받도록 타입 지정하기