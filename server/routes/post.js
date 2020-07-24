const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controller/post');

// Image Upload setting
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const upload = multer({ storage: storage });

router.post('/create-post', upload.single('image'), postController.createNewPost)
router.get('/all-post/', postController.allPost)
router.get('/all-post-following/:id', postController.allPostByFollowing)
router.get('/all-post/:id', postController.allPostByUser)
router.post('/like', postController.like)
router.post('/unlike', postController.unlike)
router.post('/comment', postController.comment)
router.post('/delete', postController.deletePost)

module.exports = router;