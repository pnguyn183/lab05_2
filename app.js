require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
        cookie: { maxAge: 1000 * 60 * 60 }, // 1 giờ
    })
);

// Routes
app.use("/api/auth", authRoutes);

// Kết nối MongoDB và chạy server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () =>
            console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
        );
    })
    .catch(err => console.error(err));