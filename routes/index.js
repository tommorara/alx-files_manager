/**
 * Defines the routes for the application.
 */

import { Router } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import UsersController from '../controllers/UsersController';

const router = Router();

/**
 * Route to get the status of the application.
 * @name GET /status
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/status', async (req, res) => AppController.getStatus(req, res));

/**
 * Route to get the statistics of the application.
 * @name GET /stats
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/stats', async (req, res) => AppController.getStats(req, res));

/**
 * Route to create a new user.
 * @name POST /users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/users', async (req, res) => UsersController.postNew(req, res));

/**
 * Route to authenticate a user.
 * @name GET /users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/users', async (req, res) => AuthController.getConnect(req, res));

/**
 * Route to invalidate user token and log them out.
 * @name GET /disconnect
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/disconnect', async (req, res) => AuthController.getDisconnect(req, res));

/**
 * Route to retrieve the current authenticated user's information.
 *
 * @name GET /users/me
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/users/me', async (req, res) => UsersController.getMe(req, res));

/**
 * Route to upload a file.
 *
 * @name POST /files
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/files', async (req, res) => FilesController.postUpload(req, res));

/**
 * @route GET /files/:id
 * @group Files - Operations about files
 * @param {string} id.path.required - The ID of the file
 * @returns {object} 200 - An object containing file details
 * @returns {Error} 404 - File not found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 * @description Get details of a specific file by ID.
 */
router.get('/files/:id', async (req, res) => FilesController.getShow(req, res));

/**
 * @route GET /files
 * @group Files - Operations about files
 * @param {string} parentId.query.optional - The ID of the parent folder
 * @param {number} page.query.optional - The page number for pagination
 * @returns {object} 200 - An array of file objects
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 * @description Get a list of files, optionally filtered by parent folder and paginated.
 */
router.get('/files', async (req, res) => FilesController.getIndex(req, res));

/**
 * @route PUT /files/:id/publish
 * @group Files - Operations about files
 * @param {string} id.path.required - The ID of the file
 * @returns {object} 200 - An object containing the updated file details
 * @returns {Error} 404 - File not found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 * @description Publishes a file, making it public.
 */
router.put('/files/:id/publish', async (req, res) => FilesController.putPublish(req, res));

/**
 * @route PUT /files/:id/unpublish
 * @group Files - Operations about files
 * @param {string} id.path.required - The ID of the file
 * @returns {object} 200 - An object containing the updated file details
 * @returns {Error} 404 - File not found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 500 - Internal server error
 * @description Unpublishes a file, making it private.
 */
router.put('/files/:id/unpublish', async (req, res) => FilesController.putUnpublish(req, res));

/**
 * Return the data stored in a file.
 */
router.get('/files/:id/data', async (req, res) => FilesController.getFile(req, res));
export default router;
