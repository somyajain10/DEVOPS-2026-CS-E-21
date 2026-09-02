import { useState } from "react";

function Eligibility() {
  const [student, setStudent] = useState({
    cgpa: "",
    backlogs: "",
    branch: "",
  });

  const [result, setResult] = useState(null);

  const company = {
    name: "Tech Solutions Pvt. Ltd.",
    role: "Software Developer",
    minimumCgpa: 7.0,
    maximumBacklogs: 0,
    allowedBranches: ["CSE", "IT", "ECE"],
  };

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });

    setResult(null);
  };

  const checkEligibility = (e) => {
    e.preventDefault();

    const cgpaEligible =
      Number(student.cgpa) >= company.minimumCgpa;

    const backlogEligible =
      Number(student.backlogs) <= company.maximumBacklogs;

    const branchEligible =
      company.allowedBranches.includes(student.branch);

    const isEligible =
      cgpaEligible && backlogEligible && branchEligible;

    setResult({
      eligible: isEligible,
      message: isEligible
        ? "Congratulations! You meet all the eligibility requirements."
        : "You currently do not meet one or more eligibility requirements.",
    });
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Check Eligibility</h1>
        <p>
          Enter your academic details to check your eligibility for a
          placement opportunity.
        </p>
      </div>

      {/* Company Requirements */}
      <div className="content-card eligibility-company-card">
        <div>
          <h2>{company.name}</h2>
          <p className="company-role">{company.role}</p>
        </div>

        <div className="eligibility-requirements">
          <div className="requirement-item">
            <span>Minimum CGPA</span>
            <strong>{company.minimumCgpa}</strong>
          </div>

          <div className="requirement-item">
            <span>Maximum Backlogs</span>
            <strong>{company.maximumBacklogs}</strong>
          </div>

          <div className="requirement-item">
            <span>Eligible Branches</span>
            <strong>{company.allowedBranches.join(", ")}</strong>
          </div>
        </div>
      </div>

      {/* Eligibility Form */}
      <div className="content-card">
        <h2>Enter Your Details</h2>

        <p className="section-description">
          Your details will be compared with the company requirements.
        </p>

        <form onSubmit={checkEligibility}>
          <div className="form-grid">
            <div className="form-group">
              <label>CGPA</label>
              <input
                type="number"
                name="cgpa"
                min="0"
                max="10"
                step="0.01"
                placeholder="Example: 8.5"
                value={student.cgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Number of Backlogs</label>
              <input
                type="number"
                name="backlogs"
                min="0"
                placeholder="Example: 0"
                value={student.backlogs}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Branch</label>
              <select
                name="branch"
                value={student.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">Mechanical</option>
                <option value="CE">Civil</option>
              </select>
            </div>
          </div>

          <button type="submit" className="primary-button">
            Check Eligibility
          </button>
        </form>

        {result && (
          <div
            className={
              result.eligible
                ? "eligibility-result eligible"
                : "eligibility-result not-eligible"
            }
          >
            <h2>
              {result.eligible
                ? "Eligible ✓"
                : "Not Eligible"}
            </h2>

            <p>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Eligibility;