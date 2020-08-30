const {Router} = require('express')
const Cart = require('../models/cart')
const Course = require('../models/course')
const router = Router()

router.post('/add', async (req, res) => {
    if (!req.body.id) {
        return res.redirect('/courses')
    }
    const course = await Course.getById(req.body.id)
    await Card.add(course)
    res.redirect('/card')
})

router.get('/', async (req, res) => {
    const card = await Card.fetch()
    res.render('card', {
        title: 'Cart',
        isCard: true,
        card
    })
})
// index
// create
// store
// show
// edit
// update
//destroy

module.exports = router