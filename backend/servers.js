require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const admissionRoutes = require("./routes/AdmissionRoute");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,https://tti-admission.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/admission", admissionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

const PORT = process.env.PORT || 5550;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
