const userModel = require('../models/users');
const postModel = require('../models/posts');
const fs = require('fs');

class User {

    async userDetails(req, res) {
        try {
            const detail = await userModel.findOne({ _id: req.params.user_id }).select("-password").populate("followers","name email profile_pic").populate("following","name email profile_pic")
            const posts = await postModel.find({ postedBy: req.params.user_id }).populate("postedBy", "name email profile_pic followers following").populate("comments.postedBy", "name profile_pic followers following")
            return res.json({
                detail,
                posts
            })
        } catch (err) {
            console.log(err)
        }
    }

    async followData(req, res) {
        try {
            const detail = await userModel.findOne({ _id: req.params.user_id }).select("followers following")
            return res.json({
                followers:detail.followers,
                following:detail.following
            })
        } catch (err) {
            console.log(err)
        }
    }

    

    followUser(req, res) {
        let { followId } = req.body
        let loggedInUser = req.userDetails._id
        userModel.findByIdAndUpdate(followId, {
            $push: { followers: loggedInUser }
        }, {
            new: true
        }).exec(err => {
            if (err) { console.log(err) }
            userModel.findByIdAndUpdate(loggedInUser, {
                $push: { following: followId }
            }, {
                new: true
            }).exec(err => {
                if (err) { console.log(err) }
                res.json({ message: "Follow done" })
            })
        })
    }

    unfollowUser(req, res) {
        let { followId } = req.body
        let loggedInUser = req.userDetails._id
        userModel.findByIdAndUpdate(followId, {
            $pull: { followers: loggedInUser }
        }, {
            new: true
        }).exec(err => {
            if (err) { console.log(err) }
            userModel.findByIdAndUpdate(loggedInUser, {
                $pull: { following: followId }
            }, {
                new: true
            }).exec(err => {
                if (err) { console.log(err) }
                res.json({ message: "Unfollow done" })
            })
        })
    }

    changeProfilePic(req, res) {
        let profile_pic = req.file.filename
        let loggedInUser = req.userDetails._id
        let reqUserId = req.body.id
        let oldPic = req.body.oldPic

        if (oldPic !== "user.png") {
            const filePath = `../server/public/uploads/profile_pic/${oldPic}`;
            fs.unlink(filePath, (err) => {
                if (err) { console.log(err) }
                if (reqUserId === loggedInUser) {
                    userModel.findByIdAndUpdate(loggedInUser, {
                        profile_pic
                    }).exec((err, result) => {
                        if (err) { console.log(err) }
                        res.json({ result })
                    })
                } else {
                    res.status(404)
                }
            })
        } else {
            if (reqUserId === loggedInUser) {
                userModel.findByIdAndUpdate(loggedInUser, {
                    profile_pic
                }).exec((err, result) => {
                    if (err) { console.log(err) }
                    res.json({ result })
                })
            } else {
                res.status(404)
            }
        }


    }

    async searchUser(req, res) {
        const query = req.body.query
        const srchPattern = new RegExp("^" + query)
        if (!query.length > 0) {
            return res.json({ message: "No result found" })
        }
        try {
            let srchUser = await userModel.find({ email: { $regex: srchPattern } }).select("name email followers following profile_pic")
            res.json({ result: srchUser })
        } catch (err) {
            console.log(err)
            res.json({ message: "No result found" })
        }
    }

}

const userController = new User
module.exports = userController;