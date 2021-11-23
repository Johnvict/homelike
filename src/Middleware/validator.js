const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const schema = {};

schema.UserSignup = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(15),
});
schema.UserLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(15),
});
schema.CreateApartment = Joi.object({
  name: Joi.string().required().min(10),
  description: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  rooms: Joi.number().required(),
  type: Joi.string(),
  location: Joi.object({
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    address: Joi.string().required()
  }).required()
});

schema.FavoriteApartment = Joi.object({
  apartment_id: Joi.objectId().required()
})

module.exports.schemas = {
  ...schema,
};

module.exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 'failed',
      description: error.details[0].message,
    });
  }
  next();
};
