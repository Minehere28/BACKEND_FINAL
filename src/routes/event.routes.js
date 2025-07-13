import express from 'express';
import * as eventController from '../controllers/event.controller.js';
import { protect, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

router.use(protect);

router.post('/', isAdmin, eventController.createEvent);
router.put('/:id', isAdmin, eventController.updateEvent);
router.delete('/:id', isAdmin, eventController.deleteEvent);

router.patch('/:id/lock', isAdmin, eventController.lockEvent);
router.patch('/:id/unlock', isAdmin, eventController.unlockEvent);

router.post('/:id/register', eventController.registerEvent);
router.delete('/:id/register', eventController.unregisterEvent);

router.get('/:id/registrations', isAdmin, eventController.getEventRegistrations);

export default router;