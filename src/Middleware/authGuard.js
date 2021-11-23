const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const catchAsync = require('../Utils/CatchAsync');
const User = require('../Models/UserModel');
const AppError = require('../Utils/AppError');

exports.protectRoute = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('unauthenticated user', 401));
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('decoded:', decoded);
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new AppError('invalid user token', 401));
    
    if (currentUser.changedPasswordAfter(decoded.iat)) return new AppError('user password recently changed, please login again.', 401);

    req.user = currentUser;
    next(); 
});
