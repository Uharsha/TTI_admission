const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // Expecting: Bearer <token>
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader; // fallback if only token is sent
    }

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request
    req.user = decoded;

    // Continue to next middleware/route
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = auth;
