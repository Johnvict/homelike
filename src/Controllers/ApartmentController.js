// const User = require('../Models/UserModel');
const catchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');
const Apartment = require('./../Models/ApartmentModel');
const FavoriteApartment = require('./../Models/FavoriteApartmentModel');
const ApiFeatures = require('./../Utils/ApiFeatures');

//ROUTE HANDLERS

/**
 * Creates a new apartment
 */
exports.create = catchAsync(async (req, res) => {
  const apartment = await Apartment.create({
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    country: req.body.country,
    rooms: req.body.rooms,
    type: req.body.type,
    user: req.user._id,
    location: {
      type: 'Point',
      address: req.body.location.address,
      coordinates: [req.body.location.longitude, req.body.location.latitude],
    },
  });
  return res.status(201).json({
    status: 'success',
    data: apartment,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const apartments = await Apartment.find();

  return res.status(200).json({
    status: 'success',
    data: apartments,
  });
});

exports.filter = catchAsync(async (req, res, next) => {
  let { distance, latlng } = req.query;
  let geoData = { distance: null, lat: null, lng: null};
  if (latlng) {
    let [lat, lng] = latlng.split(',');
  
    if (!lat || !lng) {
      return next(
        new AppError(
          'Please provide latitude and longitude in the format latitude,longitude',
          400
        )
      );
    }

    geoData = {
      distance,
      lat: Number(lat),
      lng: Number(lng)
    }
  }


  const features = new ApiFeatures(Apartment.find(), req.query, geoData)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const apartments = await features.query;

    return res.status(200).json({
        status: 'success',
        result: apartments.length,
        data: {
            apartments
        }
    });
});

exports.filterLocation = catchAsync(async (req, res, next) => {
  const { distance, latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format latitude,longitude',
        400
      )
    );
  }
});

exports.markFavorite = catchAsync(async (req, res, next) => {
  const data = {
    apartment: req.body.apartment_id,
    user: req.user.id,
  };

  let favorite = await FavoriteApartment.findOne({
    $and: [{ ...data }],
  });

  if (favorite) {
    return res.status(200).json({
      status: 'Already exists',
      data: favorite,
    });
  }

  favorite = await FavoriteApartment.create(data);

  favorite = await FavoriteApartment.findById(favorite._id);
  return res.status(201).json({
    status: 'success',
    data: favorite,
  });
});

exports.getFavorites = catchAsync(async (req, res, next) => {
  const favorites = await FavoriteApartment.find(); //.populate('apartment');

  return res.status(201).json({
    status: 'success',
    data: favorites,
  });
});
