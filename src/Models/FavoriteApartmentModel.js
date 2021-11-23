const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: [Number],
  address: String,
});

const favoriteApartmentSchema = new mongoose.Schema(
  {
    apartment: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please send a valid apartment id'],
      ref: 'Apartment',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please add a valid user id'],
      ref: 'User',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

favoriteApartmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'apartment',
    select: '-__v',
  });

  next();
});
favoriteApartmentSchema.pre(/^find/, function (next) {
  this.select('-__v -user -id');
  next();
});

const FavoriteApartment = mongoose.model(
  'FavoriteApartment',
  favoriteApartmentSchema
);
module.exports = FavoriteApartment;
