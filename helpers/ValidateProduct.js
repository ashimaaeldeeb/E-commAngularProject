const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const productSchema = Joi.object({
    title: Joi.string().required(),
    images: Joi.array().items(Joi.string().required()).default([]),
    price: Joi.number().required(),
    details:Joi.object({
        Brand: Joi.string(),
        Processor: Joi.string(),
        Ram: Joi.string(),
        HardDisk: Joi.string(),
        GPU: Joi.string(),
        Color: Joi.string()
    }),
    ratioOfPromotion: Joi.number(),
    isPromoted: Joi.boolean().default(false),
    quantity: Joi.number().required(),
    isDeleted: Joi.boolean().default(false),
    // rate: Joi.number(),
    // review: Joi.number()
});

const validateProduct = product => productSchema.validate(product, { abortEarly: false });

module.exports = validateProduct;