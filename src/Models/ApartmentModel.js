const mongoose = require('mongoose');
const validator = require('validator');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: [Number],
  address: String
});

const apartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Enter a name for this apartment'],
    },
    description: {
      type: String,
      required: [true, 'Send a brief description for this apartment'],
    },
    city: {
      type: String,
      required: [true, 'Send a city name for this apartment'],
    },
    country: {
      type: String,
      required: [true, 'Send a country name for this apartment'],
    },
    rooms: {
      type: Number,
      required: [true, 'Send number of rooms for this apartment'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please add a valid user id'],
      ref: 'User',
    },
    type: {
      type: String,
      required: [true, 'Send type of apartment'],
    },
    location: {
      type: pointSchema,
      required: [true, 'Send location coordinates for this apartment'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
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

// //Child referencing (Virtual populate)
// apartmentSchema.virtual('favorite_apartments', {
//   ref: 'FavoriteApartment',
//   foreignField: 'apartment',
//   localField: '_id',
// });

apartmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v',
  });

  next();
});
apartmentSchema.pre(/^find/, function (next) {
  this.select('-__v -id');
  next();
});

apartmentSchema.index({ startLocation: '2dsphere'});



const Apartment = mongoose.model('Apartment', apartmentSchema);
module.exports = Apartment;
