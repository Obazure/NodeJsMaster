const {Router} = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/user')
const router = Router()
const config = require('../config/config')
const sgMail = require('@sendgrid/mail');
const registrationSuccessMessage = require('../views/emails/registration-success')
cosnt = resetPasswordMessage = require('../views/emails/reset-password')
sgMail.setApiKey(config.SENDGRID_API_KEY);

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'LogIn',
        isLogin: true,
        loginError: req.flash('login-error'),
        registerError: req.flash('register-error')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) throw err
                    else res.redirect('/courses')
                })
            } else {
                req.flash('login-error', 'Password is wrong.')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('login-error', 'Email is wrong.')
            res.redirect('/auth/login#login')
        }


    } catch (e) {
        console.log(e)
    }


})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})
        if (password !== repeat) {
            res.redirect('/auth/login#register')
        }
        if (candidate) {
            req.flash('register-error', 'Email is busy.')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            sgMail.send(registrationSuccessMessage(user.email))
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})

router.get('/reset', async (req, res) => {
    res.render('auth/reset', {
        title: 'Reset Password',
        isLogin: true,
        resetError: req.flash('reset-error'),
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('reset-error', 'Something went wrong, please repeat.')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')

            const candidate = await User.findOne({email: req.body.email})
            if (candidate) {
                candidate.resetPassToken = token
                candidate.resetTokenExp = Date.now() + 3600 * 1000
                await candidate.save()
                await sgMail.send(resetPasswordMessage(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('reset-error', 'User not found.')
                return res.redirect('/auth/reset')
            }

        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router