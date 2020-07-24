const postModel = require('../models/posts');
const userModel = require('../models/users');
const fs = require('fs');

class Post {

    createNewPost(req, res) {
        let { title, body, postedBy } = req.body
        let image = req.file.filename
        if (!title || !body || !image) {
            return res.json({
                error: "You must need to filled title,body & image also."
            })
        }
        if (title.length > 55) {
            return res.json({
                error: "Post title can't be 55 upper."
            })
        }
        // const postedBy = req.userDetails._id
        const newPost = new postModel({
            title,
            body,
            postedBy,
            image
        })

        newPost.save((err, response) => {
            if (err) { console.log(err) };
            return res.json({
                response,
                message: "Post published successfully."
            })
        })

    }

    // All post global
    allPost(req, res) {
        let posts = postModel.find({}).populate("postedBy", "_id name profile_pic").populate("comments.postedBy", "_id name").sort({ _id: -1 })
        posts.exec((err, posts) => {
            if (err) { console.log(err) };
            res.json({
                posts
            })
        })

    }

    //  Post by following
    async allPostByFollowing(req, res) {
        let loggedInUserId = req.params.id
        try {
            let logData = await userModel.findOne({ _id: loggedInUserId }).select("followers following")
            let posts = postModel.find({ postedBy: { $in: logData.following } }).populate("postedBy", "_id name profile_pic").populate("comments.postedBy", "_id name profile_pic").sort({ _id: -1 })
            posts.exec((err, posts) => {
                if (err) { console.log(err) };
                res.json({
                    posts
                })
            })
        } catch (err) {
            console.log(err)
        }

    }

    // Paticuler post a user
    allPostByUser(req, res) {
        const userId = req.params.id
        let posts = postModel.find({ postedBy: userId }).populate("postedBy", "_id name profile_pic").sort({ _id: -1 });
        posts.exec((err, posts) => {
            if (err) { console.log(err) };
            return res.json({ posts })
        })
    }

    like(req, res) {
        postModel.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.userDetails._id }
        }, {
            new: true
        }).exec((err, result) => {
            if (err) { console.log(err) }
            return res.json(result)
        })
    }

    unlike(req, res) {
        postModel.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.userDetails._id }
        }, {
            new: true
        }).exec((err, result) => {
            if (err) { console.log(err) }
            return res.json(result)
        })
    }

    comment(req, res) {
        postModel.findByIdAndUpdate(req.body.postId, {
            $push: {
                comments: {
                    text: req.body.text,
                    postedBy: req.userDetails._id
                }
            }
        }).populate("comments.postedBy", "_id name").exec((err, result) => {
            if (err) { console.log(err) }
            res.json({ result })
        })
    }


    deletePost(req, res) {
        const filePath = `../server/public/uploads/${req.body.filename}`;
        let del = postModel.findByIdAndDelete(req.body.postId)
        if (req.body.loggedInUser === req.userDetails._id) {
            del.exec((err, result) => {
                if (err) { console.log(err) }
                fs.unlink(filePath, (err) => {
                    if (err) { console.log(err) }
                    return res.json({ result: "Post delete successfully" })
                })
            })
        }
    }


}

const postController = new Post
module.exports = postController;