const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

function mapCartItems(cart) {
    return cart.items.map(course => {
        return {
            ...course.courseId._doc,
            id: course.courseId.id,
            count: course.count
        }
    })
}

function calculatePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

// index
router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCartItems(user.cart)
    const price = calculatePrice(courses)

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
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCartItems(user.cart)
    const price = calculatePrice(courses)
    const cart = {courses, price}
    res.status(200).json(cart)
})

module.exports = router