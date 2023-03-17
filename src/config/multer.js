const multer  = require('multer');
const storage = multer.diskStorage ({
    destination: './public/uploads/',
    filename: (req, file, done) => {
        done (null, Date.now()+'.'+file.mimetype.slice(6))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, done) => {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        return done (null, true);
        }
        logger.warn("Invalid type of file")
        return done (null, false);
    }
 });

 module.exports = upload;