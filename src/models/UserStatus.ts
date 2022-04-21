export interface IUserStatus {
  userStatusId: number;
  name: string;
  engName: string;
}

export const USER_STATUS = {
  dormantMember: 1,
  member: 2,
  withdrawalMember: 3,
  waitingApproval: 4
}