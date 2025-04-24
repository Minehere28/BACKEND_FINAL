import express from 'express';
import AuthController from './auth.controller.js';

const authRoute = express.Router();

authRoute.post('/register', AuthController.register);
authRoute.post('/example', AuthController.example);

export default authRoute;
