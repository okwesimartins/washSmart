import Joi from "joi";


export const registerationValidation = data => {
    const schema = Joi.object( {
        name: Joi.string()
        .min(6)
        .required(),
        email: Joi.string()
        .min(6)
        .required()
        .email(),
        phone_number: Joi.string().
        min(6).required(),
        password: Joi.string()
        .min(6)
        .required()
    });

    return schema.validate(data);
}

export const loginValidation = data => {
    const schema = Joi.object( {
        email: Joi.string()
        .min(6)
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required()
    });

    return schema.validate(data);

};


export const forgotpasswordValidation = data => {
    const schema = Joi.object( {
        email: Joi.string()
        .min(6)
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required(),
        otp: Joi.string()
        .required(),
        hash: Joi.string()
        .required()

    });

    return schema.validate(data);

};

export const driverUpdateValidation = data => {
    const schema = Joi.object( {
        email: Joi.string()
        .min(6)
        .required()
        .email(),
        name: Joi.string()
        .min(6)
        .required(),
        phone_number: Joi.string()
        .min(6)
        .required()
    });

    return schema.validate(data);

};