import Event from '../models/event.js';
import AppError from '../utils/appError.js';

export const createEvent = async (data) => {
  return await Event.create(data);
};

export const getAllEvents = async () => {
  return await Event.find().sort({ startTime: 1 });
};

export const getEventById = async (id) => {
  return await Event.findById(id);
};

export const updateEvent = async (id, data) => {
  return await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteEvent = async (id) => {
  return await Event.findByIdAndDelete(id);
};

export const lockEvent = async (id) => {
  return await Event.findByIdAndUpdate(id, { isLocked: true }, { new: true });
};

export const unlockEvent = async (id) => {
  return await Event.findByIdAndUpdate(id, { isLocked: false }, { new: true });
};

export const registerEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError('Không tìm thấy sự kiện', 404);
  if (event.registrations.some(r => r.user.toString() === userId)) {
    throw new AppError('Bạn đã đăng ký sự kiện này', 400);
  }
  event.registrations.push({ user: userId });
  await event.save();
  return event;
};

export const unregisterEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError('Không tìm thấy sự kiện', 404);
  event.registrations = event.registrations.filter(r => r.user.toString() !== userId);
  await event.save();
  return event;
};

export const getEventRegistrations = async (eventId) => {
  const event = await Event.findById(eventId).populate('registrations.user', 'username email');
  if (!event) throw new AppError('Không tìm thấy sự kiện', 404);
  return event.registrations;
};