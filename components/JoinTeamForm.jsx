"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Upload, Send, CheckCircle2, FileText } from "lucide-react";

const ALLOWED_EXT = ["pdf", "docx", "txt"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function JoinTeamForm() {
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      location: "",
      expertise: "",
      role: "",
      message: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name.trim()) errors.name = "Name is required.";
      if (!values.email.trim()) errors.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        errors.email = "Enter a valid email.";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      setServerError("");

      // Validate the file (Formik doesn't manage file inputs)
      if (!resume) {
        setResumeError("Please attach your resume.");
        return;
      }

      const data = new FormData();
      Object.entries(values).forEach(([k, v]) => data.append(k, v));
      data.append("resume", resume);

      try {
        const res = await fetch("/api/join-our-team", {
          method: "POST",
          body: data,
        });
        const json = await res.json();

        if (res.ok) {
          setDone(true);
          resetForm();
          setResume(null);
        } else {
          setServerError(json.message || "Something went wrong.");
        }
      } catch {
        setServerError("Something went wrong. Please try again.");
      }
    },
  });

  function handleFile(e) {
    const file = e.target.files?.[0];
    setResumeError("");
    if (!file) {
      setResume(null);
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      setResumeError("Resume must be a PDF, DOCX, or TXT file.");
      setResume(null);
      return;
    }
    if (file.size > MAX_SIZE) {
      setResumeError("Resume is too large (max 5 MB).");
      setResume(null);
      return;
    }
    setResume(file);
  }

  if (done) {
    return (
      <div className="jt-success">
        <div className="jt-success-icon">
          <CheckCircle2 size={26} />
        </div>
        <h3>Submission received</h3>
        <p>
          Thank you for your interest in joining ABGCC. We&apos;ll keep your
          details on file and reach out when a relevant opportunity arises.
        </p>
      </div>
    );
  }

  const err = (field) => formik.touched[field] && formik.errors[field];

  return (
    <form className="jt-form" onSubmit={formik.handleSubmit} noValidate>
      <div className="jt-grid">
        <div className="jt-field">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={err("name") ? "jt-input-error" : ""}
          />
          {err("name") && <span className="jt-error">{formik.errors.name}</span>}
        </div>

        <div className="jt-field">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={err("email") ? "jt-input-error" : ""}
          />
          {err("email") && <span className="jt-error">{formik.errors.email}</span>}
        </div>

        <div className="jt-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="City, Country"
            value={formik.values.location}
            onChange={formik.handleChange}
          />
        </div>

        <div className="jt-field">
          <label htmlFor="expertise">Area of Expertise</label>
          <input
            id="expertise"
            name="expertise"
            type="text"
            placeholder="e.g. Finance, Law, Tech"
            value={formik.values.expertise}
            onChange={formik.handleChange}
          />
        </div>
      </div>

      <div className="jt-field">
        <label htmlFor="role">Desired Role / Internship Interest</label>
        <input
          id="role"
          name="role"
          type="text"
          value={formik.values.role}
          onChange={formik.handleChange}
        />
      </div>

      <div className="jt-field">
        <label htmlFor="message">Message (optional)</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formik.values.message}
          onChange={formik.handleChange}
        />
      </div>

      {/* Resume upload */}
      <div className="jt-field">
        <label>Resume * <span className="jt-hint">(PDF, DOCX, or TXT · max 5 MB)</span></label>

        <button
          type="button"
          className="jt-upload"
          onClick={() => fileInputRef.current?.click()}
        >
          {resume ? (
            <>
              <FileText size={18} />
              <span className="jt-upload-name">{resume.name}</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>Upload your resume</span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFile}
          hidden
        />

        {resumeError && <span className="jt-error">{resumeError}</span>}
      </div>

      <button type="submit" className="jt-submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Submitting…" : "Submit Application"}
        <Send size={16} />
      </button>

      {serverError && <p className="jt-server-error">{serverError}</p>}
    </form>
  );
}
