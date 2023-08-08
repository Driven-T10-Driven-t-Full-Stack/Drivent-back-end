import redis from "@/config/redis";
import { cleanCache } from "./helpers";

afterAll(async () => {
  await cleanCache();
  redis.quit();
});
