const {Router} = require('express')
const auth = require('../middleware/auth')
const Course = require('../models/course')
const router = Router()

// index
router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'name email')
        // .select('')
        .lean()
    res.render('courses', {
        title: ' Courses',
        isCourses: true,
        courses
    })
})

// create
router.get('/create', auth, (req, res) => {
    res.render('course-create', {
        title: ' Courses managing',
        isCreateCourse: true,
    })
})

// store
router.post('/', auth, async (req, res) => {
    const course = new Course({
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
    res.redirect('/courses')
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
router.get('/:id/edit', auth, async (req, res) => {
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
router.post('/:id', auth, async (req, res) => {
    if (!req.query.allow || !req.params.id) {
        return res.redirect('/courses')
    }
    await Course.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/courses')
})

//destroy
router.post('/:id/delete', auth, async (req, res) => {
    if (!req.query.allow || !req.params.id) {
        return res.redirect('/courses')
    }
    await Course.findByIdAndRemove(req.params.id)
    res.redirect('/courses')
})

module.exports = router