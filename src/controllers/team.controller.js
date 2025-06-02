import Team from '../models/team.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const createTeam = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError('Tên team không được để trống', 400));
  }

  const newTeam = await Team.create({ name });

  res.status(201).json({
    success: true,
    data: {
      team: newTeam
    }
  });
});
