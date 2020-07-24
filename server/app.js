const express = require('express');
// const cors = require('cors');
const app = express();

const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const userRoute = require('./routes/user');

// Connected to Database
require('./config/db');

// Middleware use
app.use(express.static('public'))
const { loginCheck } = require('./middleware/auth');
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
// app.use(cors())

// All Routes
app.use('/', authRoute)
app.use('/', loginCheck, postRoute)
app.use('/', loginCheck, userRoute)

// Server Run
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on ", PORT)
})