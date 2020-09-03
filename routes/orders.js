const {Router} = require('express')
const auth = require('../middleware/auth')
const Order = require('../models/order')
const router = Router()

// index
router.get('/', auth, async (req, res) => {
    const orders = await Order.find({'user.userId': req.user._id})
        .populate('user.userId')
        .lean()
    const response = {
        title: ' Orders',
        isOrders: true,
        orders: orders.map(o => {
            return {
                ...o,
                price: o.courses.reduce((total, c) => {
                    return total += c.course.price * c.count
                }, 0)
            }
        })
    }
    res.render('orders', response)
})

// create
// store
router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate()
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc}
        }))

        const order = new Order({
            user: {
                name: user.name,
                userId: user
            },
            courses
        })
        await order.save()
        await user.clearCart()
    } catch (e) {
        console.log(e)
    }
    res.redirect('/orders')
})

module.exports = router