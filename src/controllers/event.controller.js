import * as eventService from '../services/event.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import mongoose from 'mongoose';

export const createEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.createEvent({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: { event } });
});

export const getAllEvents = catchAsync(async (req, res, next) => {
  const events = await eventService.getAllEvents();
  res.status(200).json({ success: true, data: { events } });
});

export const getEvent = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('ID không hợp lệ', 400));
  }
  const event = await eventService.getEventById(req.params.id);
  if (!event) return next(new AppError('Không tìm thấy sự kiện', 404));
  res.status(200).json({ success: true, data: { event } });
});

export const updateEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.updateEvent(req.params.id, req.body);
  if (!event) return next(new AppError('Không tìm thấy sự kiện', 404));
  res.status(200).json({ success: true, data: { event } });
});

export const deleteEvent = catchAsync(async (req, res, next) => {
  await eventService.deleteEvent(req.params.id);
  res.status(204).json({ success: true, data: null });
});

export const lockEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.lockEvent(req.params.id);
  if (!event) return next(new AppError('Không tìm thấy sự kiện', 404));
  res.status(200).json({ success: true, data: { event } });
});

export const unlockEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.unlockEvent(req.params.id);
  if (!event) return next(new AppError('Không tìm thấy sự kiện', 404));
  res.status(200).json({ success: true, data: { event } });
});

export const registerEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.registerEvent(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: { event } });
});

export const unregisterEvent = catchAsync(async (req, res, next) => {
  const event = await eventService.unregisterEvent(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: { event } });
});

export const getEventRegistrations = catchAsync(async (req, res, next) => {
  const registrations = await eventService.getEventRegistrations(req.params.id);
  res.status(200).json({ success: true, data: { registrations } });
});