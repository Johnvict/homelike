const User = require('../Models/UserModel');
const catchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');

//ROUTE HANDLERS
exports.getProfile = catchAsync(async (req, res) => {
  return res.status(200).json({
    status: 'success',
    data: req.user
  });
});
