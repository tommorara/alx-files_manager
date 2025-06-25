// noinspection ES6PreferShortImport
import { verifyPassword } from '../utils/auth';
import dbClient from '../utils/db';
import HTTPError from '../utils/httpErrors';
// noinspection ES6PreferShortImport
import { generateUuid } from '../utils/misc';
import redisClient from '../utils/redis';
import UsersController from './UsersController';

class AuthController {
  /**
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} JSON response with the authentication token.
   */
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization || '';
    const authCredentials = authHeader.split(' ')[1] || '';

    // Decode the credentials
    const [email, password] = Buffer.from(
      authCredentials, 'base64',
    ).toString().split(':');
    const dbUser = await dbClient.db.collection('users').findOne({ email });
    if (!dbUser) {
      return HTTPError.unauthorized(res);
    }

    if (!verifyPassword(password, dbUser.password)) {
      return HTTPError.unauthorized(res);
    }

    const token = generateUuid();
    await redisClient.set(`auth_${token}`, dbUser._id.toString(), 86400); // cache for 24 hours

    return res.status(200).json({ token });
  }

  /**
   * Disconnect a user by invalidating the token.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} JSON response with a message.
   */
  static async getDisconnect(req, res) {
    try {
      if (!redisClient.isAlive()) {
        console.error('Redis server is down');
        return HTTPError.internalServerError(res);
      }

      await UsersController.getUserData(req);

      const apiKey = `auth_${req.headers['x-token']}`;

      return redisClient
        .del(apiKey)
        .then(() => res.status(204).send(null))
        .catch(() => HTTPError.internalServerError(res,
          'An error occurred while invalidating API key'));
    } catch (error) {
      return HTTPError.unauthorized(res);
    }
  }
}

export default AuthController;
