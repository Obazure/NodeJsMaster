const {Router} = require('express')
const Course = require('../models/course')
const router = Router()


// index
router.get('/', async (req, res) => {
    const cart = await req.user.cart.items.populate('items')
    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses: cart.courses,
        price: cart.price
    })
})

// create
// store
router.post('/', async (req, res) => {
    if (!req.body.id) {
        return res.redirect('/courses')
    }
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/cart')
})

// show
// edit

// update


//destroy
router.delete('/:id', async (req, res) => {
    const cart = await Cart.remove(req.params.id)
    console.log(cart)
    res.status(200).json(cart)

})

module.exports = router