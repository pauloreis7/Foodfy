const multer = require('multer')

const maxFilesUpload = 5

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${ file.originalname }`)
    }
})

const fileFilter = (req, file, cb) => {
    const acepptedFilesFormat = [ 'image/png', 'image/jpg', 'image/jpeg' ].find(acceptedFileFormat => 
    acceptedFileFormat == file.mimetype)

    if (acepptedFilesFormat) {
        return cb(null, true)
    }
    
    return cb(null, false)
}

module.exports = multer( {
    storage,
    limits: { files: maxFilesUpload },
    fileFilter
})