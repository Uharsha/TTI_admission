const ADMISSION_TIMING = require("../Middleware/Time");

const checkAdmissionOpen = (req, res, next) => {
  const course = req.body?.course;

  if (!course || !ADMISSION_TIMING[course]) {
    return res.status(400).json({ error: "Invalid course selected" });
  }

  const today = new Date();
  const { start, end } = ADMISSION_TIMING[course];

  if (today >= start && today <= end) {
    next(); // ✅ allow submission
  } else {
    return res.status(403).json({
      error: `Admissions for ${course} are closed.`,
    });
  }
};

module.exports = checkAdmissionOpen;
