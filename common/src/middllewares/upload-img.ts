import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-'+Date.now());
    }
});

const upload = multer({ storage }).array('images');

export {upload as uploadImage} 