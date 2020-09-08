const {body, validationResult} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email').isEmail().withMessage('Email is wrong.')
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

exports.loginValidators = [
    body('email').isEmail().withMessage('Email is wrong.')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (!user) {
                    return Promise.reject('Email is wrong.')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('password', 'Password is wrong.')
        .isLength({min: 6, max: 24}).isAlphanumeric().trim()
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: req.body.email})
                const areSame = await bcrypt.compare(value, user.password)
                if (!areSame) {
                    return Promise.reject('Password is wrong.')
                }
                return true
            } catch (e) {
                console.log(e)
            }
        }),
]

exports.courseValidators = [
    body('title').isLength({min: 3})
        .withMessage('Min length for Title is 3 symbols.'),
    body('price').isNumeric()
        .withMessage('Wrong value for Price.'),
    body('img', 'Wrong URL for Image.')
        .isURL()
]