const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

// index
router.get('/', async (req, res) => {
    const courses = await Course.getAll()
    res.render('courses', {
        title: ' Courses',
        isCourses: true,
        courses
    })
})

// create
router.get('/create', (req, res) => {
    res.render('course-create', {
        title: ' Courses managing',
        isCreateCourse: true,
    })
})

// store
router.post('/', async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
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
    const course = await Course.getById(req.params.id)
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
    const course = await Course.getById(req.params.id)
    res.render('course-edit', {
        title: `Edit course: ${course.title}`,
        course
    })
})

// update
router.post('/:id', async (req, res) => {
    if (!req.query.allow || req.params.id !== req.body.id) {
        return res.redirect('/courses')
    }
    await Course.update(req.params.id, req.body)
    res.redirect('/courses')
})

//destroy
router.post('/:id/delete', async (req, res) => {
    if (!req.query.allow || !req.params.id) {
        return res.redirect('/courses')
    }
    await Course.delete(req.params.id)
    res.redirect('/courses')
})

module.exports = router