const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controller/user');

// Image Upload setting
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/profile_pic')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const upload = multer({ storage: storage });

router.get('/profile/:user_id', userController.userDetails)
router.get('/follow/:user_id', userController.followData)
router.post('/follow', userController.followUser)
router.post('/unfollow', userController.unfollowUser)
router.post('/change-profile-pic', upload.single('profile_pic'), userController.changeProfilePic)
router.post('/search-user', userController.searchUser)

module.exports = router;