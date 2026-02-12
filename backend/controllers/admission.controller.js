

const Admission = require("../models/Admission");

// 1. Submit Admission (Public or Student)
exports.submitAdmission = async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json({ msg: "Admission submitted successfully buddy!", admission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Combined Get Admissions (Secure Logic)
exports.getAdmissionsByRole = async (req, res) => {
  try {
    const { role, course } = req.user; // Auth middleware nundi vastundi

    let query = {};

    if (role === "TEACHER") {
      // Teacher ki kevalam valla course and HEAD approve chesinavi matrame
      query = { 
        course: course, 
        status: "HEAD_ACCEPTED" 
      };
    } 
    // Role HEAD ayithe query empty {}, so anni admissions vastayi

    const data = await Admission.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Data fetch fail ayindi buddy!" });
  }
};

// 3. Head Action (Approve)
exports.headApprove = async (req, res) => {
  try {
    await Admission.findByIdAndUpdate(req.params.id, {
      status: "HEAD_ACCEPTED"
    });
    res.json({ msg: "Head Approved the application!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};