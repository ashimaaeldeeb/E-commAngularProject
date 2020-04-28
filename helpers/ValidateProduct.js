const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const productSchema = Joi.object({
    title: Joi.string().required(),
    images: Joi.array().items(Joi.string().allow('')).default([]),
    price: Joi.number().required(),
    details:Joi.object({
        Brand: Joi.string().optional().allow(''),
        Processor: Joi.string().optional().allow(''),
        RAM: Joi.string().optional().allow(''),
        HardDisk: Joi.string().optional().allow(''),
        GPU: Joi.string().optional().allow(''),
        Color: Joi.string().optional().allow('')
    }),
    ratioOfPromotion: Joi.number().optional(),
    isPromoted: Joi.boolean().default(false),
    quantity: Joi.number().required(),
    isDeleted: Joi.boolean().default(false),
    // rate: Joi.number(),
    // review: Joi.number()
});

const validateProduct = product => productSchema.validate(product, { abortEarly: false });

module.exports = validateProduct;