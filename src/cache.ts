import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on("error", (err) => console.error("erro no redis:", err));

(async () => {
  await redisClient.connect();
  console.log("redis ok");
})();

export const jwtBlacklist = {
  add: async (token: string, expiresIn: number) => {
    console.log('Add token à blacklist');
    await redisClient.setEx(`blacklist:${token}`, expiresIn, 'true');
  },
  check: async (token: string) => {
    const result = await redisClient.get(`blacklist:${token}`);
    console.log('Verificando blacklist:', result ? 'ESTÁ NA BLACKLIST' : 'NÃO está na blacklist');
    return result;
  }
};