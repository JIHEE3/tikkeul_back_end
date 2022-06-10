import redisClient from './tikkeulRedis';


export async function addMemberRefreshToken(userId: string, refreshToken: string) {

  await redisClient.set(`members/${userId}`, refreshToken);
}