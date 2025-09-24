import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on("error", (err) => console.error("erro no redis:", err));

(async () => {
  await redisClient.connect();
  console.log("redis ok");
})();
