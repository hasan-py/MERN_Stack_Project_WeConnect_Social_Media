const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const userModel = require('../models/users');

class Auth {

    async postSignup(req, res) {
        let { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.json({
                error: "Please insert all filled"
            })
        }
        try {
            const data = await userModel.findOne({ email: email })
            if (data) {
                return res.json({
                    error: "Email already exists"
                })
            } else {
                password = await bcrypt.hashSync(password, 10)
                const newUser = new userModel({
                    name,
                    email,
                    password,
                    profile_pic: "user.png"
                })
                try {
                    const response = await newUser.save()
                    if (response) {
                        return res.json({
                            message: "User register successfully"
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async postSignin(req, res) {
        let { email, password } = req.body
        if (!email || !password) {
            return res.json({
                error: "Please insert all filled"
            })
        }
        try {
            const data = await userModel.findOne({ email: email }).select("name email followers following password")
            if (!data) {
                return res.json({
                    error: "Email or password invalid"
                })
            } else {
                const login = await bcrypt.compare(password, data.password)
                if (login) {
                    const token = jwt.sign({ _id: data._id }, JWT_SECRET);
                    const decode = jwt.verify(token, JWT_SECRET)
                    return res.json({
                        message: "Login successfully",
                        token: token,
                        user: decode
                    })
                } else {
                    return res.json({
                        error: "Email or password invalid"
                    })
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

}

const authController = new Auth
module.exports = authController;