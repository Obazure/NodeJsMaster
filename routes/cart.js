const {Router} = require('express')
const Course = require('../models/course')
const router = Router()


// index
router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = user.cart.items.map(course => {
        return {...course.courseId._doc, count: course.count}
    })
    const price = courses.reduce((total, course) => {
        console.log(total)
        return total += course.price * course.count
    }, 0)

    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses,
        price
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
    const cart = await req.user.cart
    console.log(cart)
    res.status(200).json(cart)

})

module.exports = router