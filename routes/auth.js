const {Router} = require('express')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'LogIn',
        isLogin: true,
    })
})

router.post('/login', async (req, res) => {
    req.session.isAuthentificated = true
    res.redirect('/courses')
})

router.post('/register', async (req, res) => {
    res.redirect('/auth/login')
})

router.get('/logout', async (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/auth/login')
    })
})

module.exports = router