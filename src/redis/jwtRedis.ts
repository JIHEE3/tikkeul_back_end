import redisClient from 'src/redis/tikkeulRedis';


export async function addMemberRefreshToken(userId: string, refreshToken: string) {

  await redisClient.set(`members/${userId}`, refreshToken);
}

export async function addAdminRefreshToken(userId: string, refreshToken: string) {

  await redisClient.set(`admins/${userId}`, refreshToken);
}