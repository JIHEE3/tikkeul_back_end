import config from '../config';
import { IMember } from '../models/Member';
import { IAdmin } from '../models/Admin';
import jwt from "jsonwebtoken";

export function makeMemberAccessToken(member: IMember): string {
  return jwt.sign(
    {
      memberId: member.memberId,
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
    },
    config.secretKey,
    {
      expiresIn: "1h",
      // issuer: ''
      subject: "userInfo",
    }
  );
}

export function makeRefreshToken(): string {
  return jwt.sign(
    {
    },
    config.secretKey,
    {
      expiresIn: "14d",
    }
  );
}

export function makeAdminAccessToken(adminUser: IAdmin): string {
  return jwt.sign(
    {
      memberId: adminUser.adminId,
      id: adminUser.id,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
    },
    config.secretKey,
    {
      expiresIn: "1h",
      // issuer: ''
      subject: "userInfo",
    }
  );
}

