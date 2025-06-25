#!/usr/bin/env node

// Create a new Redis client

const redis = require('redis');
const { promisify } = require('util');

/**
 * Class for Redis client
 */
class RedisClient {
  constructor() {
    this.client = redis
      .createClient()
      .on('error', (err) => {
        console.error(`Redis client not connected to the server: ${err.message}`);
      })
      .on('connect', () => {
        console.log('Redis client connected to the server');
      });

    this.client.getAsync = promisify(this.client.get).bind(this.client);
  }

  /**
   * Check if the Redis client is connected to the server
   * @returns {boolean} - Returns true if the client is connected to the server,
   *  otherwise returns false
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get a value from the Redis client
   *
   * @param {string} key - The key to get
   */
  async get(key) {
    return this.client.getAsync(key).then((res) => res);
  }

  /**
   *
   * Set a value in the Redis client
   * @param {string} key - The key to set
   * @param {*} value - The value to set for the key
   * @param {number} duration - The duration for the key to expire
   */
  async set(key, value, duration) {
    await this.client.set(key, value);
    await this.client.expire(key, duration);
  }

  /**
   * Delete a key from the Redis client
   * @param {string} key - The key to delete
   */
  async del(key) {
    const data = await this.get(key);
    if (!data) {
      throw new Error(`${key}: not found`);
    }

    return this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
