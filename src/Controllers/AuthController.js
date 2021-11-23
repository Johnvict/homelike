const crypto = require('crypto');
const User = require('./../Models/UserModel');
const catchAsync = require('./../Utils/CatchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../Utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  console.log(process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from data
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: user,
    token,
  });
};

//ROUTE HANDLERS
exports.signUp = catchAsync(async (req, res) => {
  const data = {
    email: req.body.email,
  };

  let user = await User.findOne({
    $and: [{ ...data }],
  });

  if (user) {
    return res.status(400).json({
      status: 'Email already taken',
    });
  }

  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(user, 201, res);
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Provide your email and password', 400));
  

  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password)))
  return next(new AppError('Incorrect email or password', 401));
  
  createSendToken(user, 200, res);
};
