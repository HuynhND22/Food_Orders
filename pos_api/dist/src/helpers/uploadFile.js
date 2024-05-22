"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, path.join(__dirname, '../../public/uploads/products/'));
    },
    filename: function (req, file, cb) {
        return cb(null, Date.now() + path.extname(file.originalname));
    },
});
exports.upload = multer({ storage: storage }).array("images", 5);
