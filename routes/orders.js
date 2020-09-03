const {Router} = require('express')
const Order = require('../models/order')
const router = Router()

// index
router.get('/', async (req, res) => {
    const orders = await Order.find({'user.userId': req.user._id})
        .populate('user.userId')
        .lean()
    res.render('orders', {
        title: ' Orders',
        isOrders: true,
        orders: orders.map(o => {
            return {
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return total += c.price * c.count
                }, 0)
            }
        })

    })
})

// create
// store
router.post('/', async (req, res) => {
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