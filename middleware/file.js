const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './images/')
    },
    filename(req, file = {}, cb) {
        const { originalname } = file;
        const fileExtension = path.extname(originalname);
        cb(null, `${file.fieldname}__${Date.now()}${Date.now()}${fileExtension}`);
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }

}

module.exports = multer({storage, fileFilter})
