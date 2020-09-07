const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const router = Router()
const config = require('../config/config')
const sgMail = require('@sendgrid/mail');
const registrationSuccessMessage = require('../views/emails/registration-success')

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

module.exports = router