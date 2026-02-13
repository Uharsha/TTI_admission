import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import InputField from "./InputFeild";
import GenderRadio from "./GenderFeild";
import SelectField from "./SelectFeild";
import DistrictData from "./data/DistrictData";
import Ratio from "./Ratio";
import RatioKnowledge from "./RatioKnowledge";
import RatioBasic from "./RatioBasic";

const API_BASE_URL = "https://tti-dashborad.onrender.com";
const formatDobForAssistiveText = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
const submitAdmission = (formData, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/admission/saveAdmission`);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(Math.min(95, Math.max(1, percent)));
    };

    xhr.onload = () => {
      let data = {};
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        data = {};
      }
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        data,
      });
    };

    xhr.onerror = () => reject(new Error("Network request failed."));
    xhr.send(formData);
  });

function AdmissionForm() {
  const initialFormState = {
    name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    state: "",
    district: "",
    course: "",
    disabilityStatus: "",
    education: "",
    enrolledCourse: "",
    basicComputerKnowledge: "",
    basicEnglishSkills: "",
    ScreenReader: "",
    declaration: false
  };

  const [form, setForm] = useState(() => {
    const savedForm = localStorage.getItem("admissionForm");
    if (!savedForm) return initialFormState;

    try {
      return { ...initialFormState, ...JSON.parse(savedForm) };
    } catch {
      return initialFormState;
    }
  });

  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStage, setSubmitStage] = useState("Preparing files...");

  /* ================== SAVE FORM TO LOCALSTORAGE ================== */
  useEffect(() => {
    localStorage.setItem("admissionForm", JSON.stringify(form));
  }, [form]);

  /* ================== HANDLE CHANGE ================== */
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value
  }));
};

  /* ================== HANDLE SUBMIT ================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus("");
    setMessage("");
    setSubmitProgress(0);
    setSubmitStage("Preparing files...");

    if (!form.course) {
      alert("Please select a course!");
      setLoading(false);
      return;
    }

    if (!form.declaration) {
      setStatus("error");
      setMessage("Please check the Rules and Regulations checkbox to proceed!");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.target);
    
    try {
      setSubmitStage("Uploading documents...");
      const res = await submitAdmission(formData, (percent) => {
        setSubmitProgress(percent);
      });
      const data = res.data || {};
      setSubmitStage("Finalizing submission...");
      setSubmitProgress(100);

      if (res.ok) {
        const warningText = Array.isArray(data.warnings) && data.warnings.length
          ? ` Mail status: ${data.warnings.join(" ")}`
          : "";
        setStatus("success");
        setMessage((data.message || "Submitted successfully!") + warningText);

        e.target.reset();
        setForm(initialFormState);
        localStorage.removeItem("admissionForm");
      } else if ((data.error || "").toLowerCase().includes("duplicate key")) {
        setStatus("error");
        setMessage("You have already submitted the form.");
      } else {
        setStatus("error");
        const errorText = data.error || data.message || `Submission failed with status ${res.status}`;
        setMessage(errorText);
      }
    } catch (err) {
      setStatus("error");
      setMessage("Server error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSubmitProgress(0);
        setSubmitStage("Preparing files...");
      }, 600);
    }
   
  };

  return (
    <div className="form-wrapper">
      <form
        id="main"
        role="main"
        onSubmit={handleSubmit}
        className="admission-form"
        encType="multipart/form-data"
        aria-busy={loading}
        aria-labelledby="admission-title"
      >
        <p id="admission-title" className="title">Admission</p>
        <h2>
          <span style={{ color: "white" }}>Technical Training Institute of PBMA</span>
        </h2>

        <InputField
          id="fullname"
          label="Full Name"
          placeholder="Enter your full name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <InputField
          id="email"
          label="E-mail"
          placeholder="Enter your email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

      <InputField
        id="mobile"
        label="Mobile"
        placeholder="Enter your mobile number"
        name="mobile"
        type="tel"
        value={form.mobile}
        onChange={handleChange}
        required
        // pattern="^9[0-9]{9}$"
        title="Mobile number exactly 10 digits long"
        maxLength={10}
      />

        <InputField
          id="dob"
          label="Date of Birth"
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          aria-describedby="dob-help dob-preview"
          required
        />
        <p id="dob-help" className="dob-help-text">
          Use year format YYYY. Example: 2001.
        </p>
        {form.dob && (
          <p id="dob-preview" className="dob-preview-text" aria-live="polite">
            Selected Date of Birth: {formatDobForAssistiveText(form.dob)}
          </p>
        )}

        <GenderRadio
          value={form.gender}
          placeholder="Select your gender"
          onChange={handleChange}
        />
       
        <SelectField
          id="course"
          label="Select course"
          name="course"
          options={[
          { value: "DBMS", label: "Database Management System" },
          { value: "CloudComputing", label: "Microsoft Azure (Cloud Computing)" },
          { value: "Accessibility", label: "Accessibility Testing" },
          { value: "BasicComputers", label: "Microsoft Office (Basic Computer)" },
          { value: "MachineLearning", label: "AI & Machine Learning (AIML)" }
        ]}
          value={form.course}
          onChange={handleChange}
          required
          placeholder="Select a course"
        />

        <SelectField
          id="state"
          label="State"
          placeholder="Select your state"
          name="state"
          options={Object.keys(DistrictData)}
          value={form.state}
          onChange={handleChange}
          required
        />

        <SelectField
          id="district"
          label="District"
          placeholder="Select your district"
          name="district"
          options={DistrictData[form.state] || []}
          value={form.district}
          onChange={handleChange}
          required
        />
         <InputField
          id="education"
          label="Currently pursuing any education (if yes specify)"
          placeholder="Enter your current education details"
          type="text"
          name="education"
          value={form.education}
          onChange={handleChange}
          required
        />
         <InputField
          id="enrolledCourse"
          label="currently enrolled for any specific course (if yes specify)"
          placeholder="Enter the course you are currently enrolled in"
          type="text"
          name="enrolledCourse"
          value={form.enrolledCourse}
          onChange={handleChange}
          required
        />
         <InputField
          id="disability"
          label="mention the disability status with percentage (if applicable)"
          placeholder="Enter disability details"
          type="text"
          name="disabilityStatus"
          value={form.disabilityStatus}
          onChange={handleChange}
          required
        />
        <Ratio
          value={form.basicComputerKnowledge}
          onChange={handleChange}
        />
        <RatioKnowledge 
          value={form.basicEnglishSkills}
          onChange={handleChange}
        />
       <RatioBasic value={form.ScreenReader} onChange={handleChange} />

       <InputField id="passport_photo" label="Passport Photo" type="file" name="passport_photo" placeholder="Upload passport photo" required/>
       <InputField id="adhar" label="Aadhar Card" type="file" name="adhar" placeholder="Upload Aadhar card" required />
       <InputField id="UDID" label="UDID" type="file" name="UDID" placeholder="Upload UDID document" required/>
       <InputField id="disability_cert" label="Disability Certificate" type="file" name="disability" placeholder="Upload disability certificate" required />
       <InputField id="marks" label="Degree Certificate" type="file" name="Degree_memo" placeholder="Upload degree certificate" required/>
       <InputField id="doctor" label="Medical certificate" type="file" name="doctor" placeholder="Upload medical certificate" required/>

       <div style={{ display: "flex", gap: "10px", marginTop: "20px", color: "white", alignItems: "flex-start" }}>
        <input
         id="declaration"
         type="checkbox"
         name="declaration"
         checked={form.declaration}
         onChange={handleChange}
         style={{ width: "20px", height: "20px", cursor: "pointer" }}
         aria-required={true}
        />

          <label htmlFor="declaration" style={{ fontSize: "12px", cursor: "pointer" }} required >
            I hereby declare that the information provided is true to the best of my knowledge. I understand that any false information may lead to the rejection of my application. Read the <Link to="/rules" className="rules-link">Rules and Regulations</Link> carefully before submitting the form.
          </label>
        </div>

        <div className="form-buttons-wrapper">
          {/* <Link to="/" className="back-btn" aria-label="Go to description page">
            Description
          </Link> */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* STATUS MESSAGE */}
        {status && (
          <div className={`status-box ${status}`} role="alert">
            <div className="status-icon">
              {status === "success" ? "OK" : "ERR"}
            </div>
            <p>{message}</p>
          </div>
        )}

        {loading && (
          <div className="submit-progress" role="status" aria-live="polite">
            <div className="submit-progress-head">
              <div
                className="submit-meter"
                role="progressbar"
                aria-label="Submission progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={submitProgress}
                style={{ "--progress": `${submitProgress}%` }}
              >
                <span className="submit-meter-fill" aria-hidden="true"></span>
                <span className="submit-meter-value">{submitProgress}%</span>
              </div>
              <div className="submit-progress-copy">
                <p className="submit-progress-title">{submitStage}</p>
                <p className="submit-progress-subtitle">Please wait. It may take a couple of minutes.</p>
              </div>
            </div>
            <div className="submit-progress-track" aria-hidden="true">
              <div className="submit-progress-track-fill" style={{ width: `${submitProgress}%` }}></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default AdmissionForm;

