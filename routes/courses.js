const {Router} = require('express')
const auth = require('../middleware/auth')
const Course = require('../models/course')
const router = Router()

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}

// index
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'name email')
            .lean()
        res.render('courses', {
            title: ' Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses
        })
    } catch (e) {
        console.log(e)
    }
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

    try {
        const course = await Course.findById(req.params.id).lean()

        if (!isOwner(course, req)) return res.redirect('/courses')

        res.render('course-edit', {
            title: `Edit course: ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e)
    }
})

// update
router.post('/:id', auth, async (req, res) => {
    if (!req.query.allow || !req.params.id) {
        return res.redirect('/courses')
    }
    try {
        const course = await Course.findById(req.params.id)

        if (!isOwner(course, req)) return res.redirect('/courses')

        Object.assign(course, req.body)
        await course.save()
        res.redirect('/courses')

    } catch (e) {
        console.log(e)
    }
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