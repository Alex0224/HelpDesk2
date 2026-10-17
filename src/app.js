const express = require('express');
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const session = require('express-session');
const authMiddleware = require('./middlewares/authMiddleware');

require('dotenv').config();
const app = express();

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 8
    }
}));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', userRoutes);

app.use('/dashboard', authMiddleware, (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'private', 'dashboard.html'))
});

module.exports = app;
