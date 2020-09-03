const {Router} = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'LogIn',
        isLogin: true,
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findById('5f4fafe486149f93605f09b6')
    req.session.user = user
    req.session.isAuthenticated = true
    req.session.save(err => {
        if (err) throw err
        else res.redirect('/courses')
    })
})

router.post('/register', async (req, res) => {
    res.redirect('/auth/login')
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})

module.exports = router