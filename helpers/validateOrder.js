const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const orderSchema = Joi.object({
    user: Joi.objectId().required(),
    date: Joi.date().optional(),
    price: Joi.number().default(0),
    products: Joi.array().items(Joi.object({
        product: Joi.objectId().optional(),
        quantity: Joi.number().optional(),
    })).default([]),
    status: Joi.string().valid('cancelled','pending','accepted', 'rejected').required().default('pending')
});

const validateOrder = order => orderSchema.validate(order, { abortEarly: false });

module.exports = validateOrder;