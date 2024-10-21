import { createClient } from 'redis'; // Import from the 'redis' package
import logger from '@adonisjs/core/services/logger';
import redisConfig from '#config/redis';

export default class RedisService {
  private redisClient: ReturnType<typeof createClient>;

  constructor() {
    // Create a Redis client for local instance
    this.redisClient = createClient({
      url: redisConfig.url,
    });

    // Handle Redis connection errors
    this.redisClient.on('error', (err) => {
      logger.error(`Redis connection error: ${err}`);
    });

    // Connect to Redis
    this.redisClient.connect().catch((err) => {
      logger.error(`Failed to connect to Redis: ${err}`);
    });
  }

  async get(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    if (value) {
      logger.info(`Key ${key} retrieved from cache`);
    }
    return value;
  }

  async set(key: string, value: any): Promise<void> {
    await this.redisClient.set(key, value);
    logger.info(`Key ${key} saved to cache`);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
    logger.info(`Key ${key} deleted from cache`);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redisClient.expire(key, seconds);
    logger.info(`Key ${key} will expire in ${seconds} seconds`);
  }
}
