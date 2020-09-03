const {Router} = require('express')
const Order = require('../models/order')
const router = Router()

// index
router.get('/', async (req, res) => {
    const orders = await Order.find()
        .populate('userId', 'name email')
        // .select('')
        .lean()
    res.render('orders', {
        title: ' Orders',
        isOrders: true,
        orders
    })
})

// create
// store
router.post('/', async (req, res) => {
    const course = new Order({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })
    try {
        await course.save()
    } catch (e) {
        console.log(e)
    }
    res.redirect('/orders')
})

// show
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).lean()
    res.render('course', {
        layout: 'empty',
        title: `Course: ${course.title}`,
        course
    })
})

// edit
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/courses')
    }
    const course = await Course.findById(req.params.id).lean()
    res.render('course-edit', {
        title: `Edit course: ${course.title}`,
        course
    })
})

// update
router.post('/:id', async (req, res) => {
    if (!req.query.allow || !req.params.id) {
        return res.redirect('/courses')
    }
    await Course.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/courses')
})

//destroy
router.post('/:id/delete', async (req, res) => {
    if (!req.query.allow || !req.params.id) {
        return res.redirect('/courses')
    }
    await Course.findByIdAndRemove(req.params.id)
    res.redirect('/courses')
})

module.exports = router