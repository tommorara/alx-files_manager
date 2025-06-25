#!/usr/bin/env node

// Implement a class DBClient that will be used to interact with the MongoDB database

const { MongoClient } = require('mongodb');

/**
 * Class DBClient
 */
class DBClient {
  /**
   * Constructor
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect();
    this.db = this.client.db(database);
  }

  /**
   * Check if the connection is alive
   *
   * @returns {boolean} Returns true if the client is connected to the server,
   *  otherwise returns false
   */
  isAlive() {
    return this.client.topology.isConnected();
  }

  async isAliveWithTimeout(timeout = 2000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        console.error('MongoDB ping timed out');
        resolve(false);
      }, timeout);

      this.client
        .db()
        .admin()
        .ping()
        .then(() => {
          clearTimeout(timer);
          resolve(true);
        })
        .catch((error) => {
          clearTimeout(timer);
          console.error('MongoDB ping failed:', error.message);
          resolve(false);
        });
    });
  }

  /**
   * Count the number of documents in the collection users
   */
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  /**
   * Count the number of documents in the collection files
   */
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
