const {body, validationResult} = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
    body('email').isEmail().withMessage('Wrong Email.')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('Email is busy.')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('password', 'Min length for password is 6 symbols.')
        .isLength({min: 6, max: 24}).isAlphanumeric().trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Given passwords are not the same.')
            }
            return true
        }).trim(),
    body('name', 'Name should be longer 3 symbols.')
        .isLength({min: 3}).trim()
]