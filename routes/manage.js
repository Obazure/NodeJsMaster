const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('manage', {
        title: ' Courses managing',
        isManage: true
    })
})

module.exports = router