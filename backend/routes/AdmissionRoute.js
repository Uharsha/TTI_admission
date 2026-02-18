const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const express = require("express");
const router = express.Router();
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("cloudinary").v2;

const Admission = require("../models/Admission");
const transporter = require("../models/utils/mailer");
const COURSE_TEACHERS = require("../models/utils/teacher");
const auth = require("../models/Middleware/Auth");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "admissions",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });
const normalizeRating = (value) => {
  if (value === undefined || value === null) return value;
  const cleaned = String(value).trim();
  if (!cleaned) return cleaned;

  const lower = cleaned.toLowerCase();
  if (lower === "none") return "None";

  const valid = ["Fair", "Good", "Excellent", "Outstanding"];
  const normalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  return valid.includes(normalized) ? normalized : cleaned;
};

const safeSendMail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return { success: true, error: null };
  } catch (err) {
    const error = err?.message || "Mail send failed";
    console.error("Mail send failed:", error);
    return { success: false, error };
  }
};

/* ================== SAVE ADMISSION ================== */
router.post(
  "/saveAdmission",
  upload.fields([
  { name: "passport_photo", maxCount: 1 },
  { name: "adhar", maxCount: 1 },
  { name: "UDID", maxCount: 1 },
  { name: "disability", maxCount: 1 },
  { name: "Degree_memo", maxCount: 1 },
  { name: "doctor", maxCount: 1 }
]),
  async (req, res) => {
    


    try {
      // 1. Check if files exist at all to prevent crash
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "No files were uploaded. Please attach all required documents." });
      }
      

      // 2. Safely extract paths using optional chaining
      const admissionData = {
        ...req.body,
        course: req.body.course ? req.body.course.trim() : null,
        basicComputerKnowledge: normalizeRating(req.body.basicComputerKnowledge),
        basicEnglishSkills: normalizeRating(req.body.basicEnglishSkills),
        ScreenReader: normalizeRating(req.body.ScreenReader),
        RulesDeclaration: Boolean(req.body.declaration === "true"),
        passport_photo: req.files["passport_photo"]?.[0]?.path || null,
        adhar: req.files["adhar"]?.[0]?.path || null,
        UDID: req.files["UDID"]?.[0]?.path || null,
        disability: req.files["disability"]?.[0]?.path || null,
        Degree_memo: req.files["Degree_memo"]?.[0]?.path || null,
        doctor: req.files["doctor"]?.[0]?.path || null,
      };

      // 3. Simple validation: Ensure core files are present
      if (!admissionData.passport_photo || !admissionData.adhar || !admissionData.disability || !admissionData.UDID || !admissionData.Degree_memo || !admissionData.doctor) {
        return res.status(400).json({ error: "Passport Photo, Adhar, Disability, Degree Memo, and Doctor's Certificate are mandatory." });
      }

      const admission = new Admission(admissionData);
      const user = await admission.save();

      /* ðŸ“§ Non-blocking mails: submission should not fail if mail config is broken */
      const mailResults = await Promise.all([
        safeSendMail({
          to: user.email,
          subject: "Admission Submitted TTI",
          html: `Dear ${user.name}, <br> <br>

Thank you for applying to the <b>TTI Foundation</b>.<br>

We are pleased to inform you that your admission application has been <b>successfully submitted</b>. Our team will review your application, and you will be notified about the next steps via email.<br>

Please ensure that you regularly check your email for updates regarding your application status.<br><br>
if you have any questions or need further assistance, feel free to contact us at <a href="tel:${process.env.CONTACT_NUMBER}">${process.env.CONTACT_NUMBER}</a> or <a href="mailto:${process.env.HEAD_EMAIL}">${process.env.HEAD_EMAIL}</a><br><br>
Warm regards,<br>
<b>TTI Foundation â€“ Admissions Team</b><br><br>
<p style="font-size:12px;color:#666;">
This is an automatically generated email. Replies to this message are not monitored.
</p>
`,
        }),
        safeSendMail({
          to: process.env.HEAD_EMAIL,
          subject: "New Admission Request",
          html: `
         Dear Sir/Madam,<br>

A new admission application has been submitted and requires your review.<br><br>

<b>Applicant Details:</b><br>
Name: ${user.name}<br>
Course Applied: ${user.course}<br>
<p>
      <a href="${user.passport_photo}" target="_blank">
        View Full Image
      </a>
    </p>
    <p>call: <a href="tel:${user.mobile}">${user.mobile}</a></p>
    <a href="${process.env.BASE_URL}/admission/head/approve/${user._id}" target="_blank">Accept Admission</a>
    <br>
    <a href="${process.env.BASE_URL}/admission/reject/${user._id}" target="_blank">Reject Admission</a>
    <br><br>

Please log in to the admin dashboard to review and take the necessary action.<br><br>

Regards,<br>
<b>TTI Foundation â€“ Admission System</b><br>
<p style="font-size:12px;color:#666;">
This is an automatically generated email. Replies to this message are not monitored.
</p>

        `,
        }),
      ]);

      const mailFailures = mailResults.filter((result) => !result.success);
      if (mailFailures.length > 0) {
        console.error("Admission mail delivery failed:", mailFailures.map((m) => m.error));
      }

      res.status(201).json({
        success: true,
        message: "Admission submitted successfully!",
        mailWarning: mailFailures.length > 0 ? "Submission saved, but one or more notification emails failed." : null,
      });

    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(409).json({ error: "You have already submitted the form with this email or mobile." });
      }

      if (err && err.name === "ValidationError") {
        const details = Object.values(err.errors || {}).map((e) => e.message);
        return res.status(400).json({
          error: "Admission validation failed",
          details,
        });
      }

      console.error("saveAdmission failed:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
);

/* ================== HEAD APPROVE ================== */
router.put("/head/approve/:id", async (req, res) => {
  try {
    // Only HEAD can approve at this stage
    // if (req.user.role !== "HEAD") {
    //   return res.status(403).json({ error: "Only HEAD can approve applications" });
    // }

    const user = await Admission.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Invalid request" });

    const teacher = COURSE_TEACHERS[user.course];
    if (!teacher) {
      return res.status(400).json({ error: `No teacher found for course: ${user.course}` });
    }

    user.status = "HEAD_ACCEPTED";
    await user.save();

    /* ðŸ“§ MAIL ONLY TO TEACHER */
    await transporter.sendMail({
      to: teacher.email,
      subject: "Candidate Approved â€“ Schedule Interview",
      html: `
       Dear ${teacher.name},<br>

We would like to inform you that the following candidate has been **approved by the Head** and is ready for the interview process.<br><br>

<b>Candidate Details</b><br>
Name: ${user.name}<br>
Course: ${user.course}<br>
<p>
      <a href="${user.passport_photo}" target="_blank">
        View Full Image
      </a>
    </p>

Please log in to the dashboard and schedule the interview at your convenience.<br><br>

Best regards,<br>
<b>TTI Foundation â€“ Admissions Team</b><br>
<p style="font-size:12px;color:#666;">
This is an automatically generated email. Replies to this message are not monitored.
</p>
      `,
    });

    res.json({ success: true, message: "Head approved and Teacher notified." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================== HEAD REJECT ================== */
router.put("/head/reject/:id",  async (req, res) => {
  try {
    
   

    const user = await Admission.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Invalid request" });

    user.status = "HEAD_REJECTED";
    user.finalStatus = "REJECTED";
    user.decisionDone = true;
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: "Application Rejected",
      html: `
      <p>Dear ${user.name},</p>

    <p>
      Thank you for your interest in the programs offered by 
      <b>TTI Foundation</b>.
    </p>

    <p>
      After careful review of your application, we regret to inform you that
      your application has not been approved at this stage.
    </p>

    <p>
      We appreciate the time and effort you put into submitting your application
      and encourage you to apply again in the future if you meet the eligibility criteria.
    </p>

    <p>
      We wish you all the best in your future endeavors.
    </p>

    <br>
    Warm regards,<br>
    <b>TTI Foundation â€“ Admissions Team</b>

    <br><br>
    <hr>
    <p style="font-size:12px;color:#666;">
      This is an automatically generated email. Replies to this message are not monitored.
</p>`,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== SCHEDULE INTERVIEW (TEACHER ONLY) ================== */
router.post("/schedule-interview/:id",  async (req, res) => {
  try {
    
    

    const { date, time, platform, link } = req.body;

    const student = await Admission.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Invalid request" });

  

    const updatedStudent = await Admission.findByIdAndUpdate(
      req.params.id,
      { interview: { date, time, platform, link }, status: "INTERVIEW_SCHEDULED" },
      { new: true }
    );

    // ðŸ“§ Mail interview details to student
    await transporter.sendMail({
      to: updatedStudent.email,
      subject: "Interview Scheduled â€“ TTI",
      html: `
       Dear ${updatedStudent.name},<br>

We are pleased to inform you that your interview has been scheduled.<br><br>

<b>Interview Details:</b><br>
Date: ${date}<br>
Time: ${time}<br>
Platform: ${platform}<br>
Meeting Link: ${link}<br><br>

Please ensure that you join the interview on time.<br>
We wish you the very best.<br><br>

Sincerely,<br>
<b>TTI Foundation â€“ Admissions Team</b><br>
 <p style="font-size:12px;color:#666;">
This is an automatically generated email. Replies to this message are not monitored.
</p>
      `,
    });

    res.json({ success: true, message: "Interview scheduled & mail sent"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== FINAL APPROVE (TEACHER ONLY) ================== */
router.put("/final/approve/:id",  async (req, res) => {
  try {
  

    const user = await Admission.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Invalid request" });

  

    user.status = "SELECTED";
    user.finalStatus = "SELECTED";
    user.decisionDone = true;
    await user.save();

    // ðŸ“§ Congratulations mail
    await transporter.sendMail({
      to: user.email,
      subject: "Congratulations â€“ TTI",
      html: `
      Dear ${user.name},<br>

Congratulations!<br>

We are delighted to inform you that you have been <b>successfully selected</b> after the interview process for the <b>${user.course}</b> course at <b>TTI Foundation</b>.<br>

Further instructions regarding onboarding will be shared with you shortly.<br>

We look forward to having you with us.<br><br>

Warm regards,<br>
<b>TTI Foundation â€“ Admissions Team</b><br>
<p style="font-size:12px;color:#666;">
This is an automatically generated email. Replies to this message are not monitored.
</p>
`,
    });

    res.json({ success: true, message: "Final approval done & mail sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== FINAL REJECT (TEACHER ONLY) ================== */
router.put("/final/reject/:id",  async (req, res) => {
  try {
 

    const user = await Admission.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Invalid request" });

   
    user.status = "REJECTED";
    user.finalStatus = "REJECTED";
    user.decisionDone = true;
    await user.save();

    // ðŸ“§ Apology mail
    await transporter.sendMail({
      to: user.email,
      subject: "Interview Result â€“ TTI",
      html: `
      Dear ${user.name},<br>

Thank you for taking the time to apply and attend the interview with <b>TTI Foundation</b>.<br>

After careful consideration, we regret to inform you that you have not been selected at this time.<br>

We truly appreciate your interest and encourage you to apply again in the future.<br>

We wish you all the best in your academic and professional journey.<br><br>

Sincerely,<br>
<b>TTI Foundation â€“ Admissions Team</b><br>
<p style="font-size:12px;color:#666;">
This is an automatically generated email. Replies to this message are not monitored.
</p>
      `,
    });

    res.json({ success: true, message: "Final rejection done & mail sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================== DASHBOARD APIs ================== */

// GET ADMISSIONS - return all, frontend decides what to show
router.get("/get-data", async (req, res) => {
  try {
    const admissions = await Admission.find({});
    res.json(admissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching admissions" });
  }
});

/* ================== HEAD ROUTES ================== */

// HEAD SUBMITTED APPLICATIONS
router.get("/submitted", async (req, res) => {
  try {
    const data = await Admission.find({ status: "SUBMITTED" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching submitted applications" });
  }
});

// HEAD ACCEPTED APPLICATIONS
router.get("/head-accepted", async (req, res) => {
  try {
    const data = await Admission.find({ status: "HEAD_ACCEPTED" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching head-accepted applications" });
  }
});

// HEAD REJECTED APPLICATIONS
router.get("/head-rejected", async (req, res) => {
  try {
    const data = await Admission.find({ status: "HEAD_REJECTED" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching head-rejected applications" });
  }
});

/* ================== TEACHER ROUTES ================== */

// TEACHER APPROVED CANDIDATES
router.get("/teacher-accepted", async (req, res) => {
  try {
    const data = await Admission.find({ finalStatus: "SELECTED" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching approved candidates" });
  }
});

// TEACHER REJECTED CANDIDATES
router.get("/teacher-rejected", async (req, res) => {
  try {
    const data = await Admission.find({ finalStatus: "REJECTED" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching rejected candidates" });
  }
});

/* ================== INTERVIEW ROUTE ================== */

router.get("/interview_required", async (req, res) => {
  try {
    const data = await Admission.find({ status: "INTERVIEW_SCHEDULED" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching interview list" });
  }
});

module.exports = router;

