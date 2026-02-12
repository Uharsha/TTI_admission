require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const admissionRoutes = require("./routes/AdmissionRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/admission", admissionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

app.listen(5550, () =>
  console.log("🚀 Server running on port 5550")
);
