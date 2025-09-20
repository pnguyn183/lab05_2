const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Đăng ký tài khoản
router.post("/register", async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Đăng nhập
// Đăng nhập
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Lưu userId vào session
        req.session.userId = user._id;

        // 👉 Thêm cookie 'sid' giống bài giảng viên
        res.cookie("sid", req.sessionID, {
            httpOnly: true,
            secure: false, // true nếu dùng HTTPS
            maxAge: 1000 * 60 * 60, // 1h
        });

        res.json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Đăng xuất
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
});

// Kiểm tra session
router.get("/me", (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });
    res.json({ message: "You are logged in", userId: req.session.userId });
});

module.exports = router;