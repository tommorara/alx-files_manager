/**
 * AppController class representing the controller for the application.
 */
import dbClient from '../utils/db';
import HTTPError from '../utils/httpErrors';
import redisClient from '../utils/redis';

/**
 * AppController class to handle application status and statistics.
 */
class AppController {
  /**
   * Get the status of Redis and the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} JSON response with the status of Redis and the database.
   */
  static async getStatus(req, res) {
    try {
      return res.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
    } catch (error) {
      return HTTPError.internalServerError(res);
    }
  }

  /**
   * Get the number of users and files in the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} JSON response with the number of users and files.
   */
  static async getStats(req, res) {
    try {
      return res
        .status(200)
        .json({ users: await dbClient.nbUsers(), files: await dbClient.nbFiles() });
    } catch (error) {
      console.log(`Error occurring here: ${error.message}`);
      return HTTPError.internalServerError(res);
    }
  }
}

export default AppController;
