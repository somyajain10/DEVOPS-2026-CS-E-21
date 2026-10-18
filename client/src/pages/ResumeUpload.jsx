import { useState } from "react";

function ResumeUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setSelectedFile(null);
      setMessage("Please select a valid PDF file.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage("Please select your resume before uploading.");
      return;
    }

    // Temporary frontend-only upload.
    // We will connect this to the backend later.
    setMessage(`Resume "${selectedFile.name}" is ready to upload!`);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Upload Resume</h1>
        <p>
          Upload your latest resume to apply for placement opportunities.
        </p>
      </div>

      <div className="content-card resume-card">
        <div className="resume-icon">📄</div>

        <h2>Your Resume</h2>

        <p className="section-description">
          Please upload your resume in PDF format. Make sure your resume
          contains your latest academic details, skills, and projects.
        </p>

        <form onSubmit={handleUpload}>
          <label className="upload-box">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              hidden
            />

            <span className="upload-icon">⬆</span>

            <strong>
              {selectedFile
                ? selectedFile.name
                : "Click here to select your resume"}
            </strong>

            <small>PDF files only</small>
          </label>

          <button type="submit" className="primary-button">
            Upload Resume
          </button>
        </form>

        {message && (
          <p
            className={
              selectedFile
                ? "success-message"
                : "error-message"
            }
          >
            {selectedFile ? "✓ " : "⚠ "}
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;