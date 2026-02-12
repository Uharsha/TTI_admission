const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, course } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (role === "TEACHER" && !course) {
      return res.status(400).json({ msg: "Course is required for TEACHER role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      course,
    });

    return res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password you know" });
    }

    // 🔐 Generate JWT Token
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      course: user.course || null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      msg: "Login successful",
      token,
      name: user.name,
      role: user.role,
      course: user.course,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};