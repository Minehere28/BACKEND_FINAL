import express from 'express';
import { createTeam } from '../controllers/team.controller.js';

const teamRouter = express.Router();

teamRouter.post('/', createTeam);

export default teamRouter;
