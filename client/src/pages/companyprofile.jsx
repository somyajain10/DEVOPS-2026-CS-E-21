
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/company/profile";

const emptyProfile = {
  companyName: "",
  email: "",
  website: "",
  industry: "",
  location: "",
  description: "",
};

function CompanyProfile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function requestProfile(method, body) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Login session nahi mila. Logout karke dobara login karo.");
    }

    const response = await fetch(API_URL, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Server error: ${response.status}`
      );
    }

    return data;
  }

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await requestProfile("GET");

        if (active && data.profile) {
          setProfile({
            companyName: data.profile.companyName || "",
            email: data.profile.contactEmail || "",
            website: data.profile.website || "",
            industry: data.profile.industry || "",
            location: data.profile.location || "",
            description: data.profile.description || "",
          });
        }
      } catch (error) {
        if (active) {
          setMessage(error.message);
          setMessageType("error");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function saveProfile() {
    if (saving) return;

    setSaving(true);
    setMessage("Saving profile...");
    setMessageType("info");

    try {
      const data = await requestProfile("PUT", {
        companyName: profile.companyName.trim(),
        contactEmail: profile.email.trim(),
        contactPerson: profile.companyName.trim(),
        website: profile.website.trim(),
        industry: profile.industry.trim(),
        location: profile.location.trim(),
        description: profile.description.trim(),
      });

      if (data.profile) {
        setProfile({
          companyName: data.profile.companyName || "",
          email: data.profile.contactEmail || "",
          website: data.profile.website || "",
          industry: data.profile.industry || "",
          location: data.profile.location || "",
          description: data.profile.description || "",
        });
      }

      setMessage(data.message || "Company profile saved successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(`Save failed: ${error.message}`);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="company-dashboard">Loading profile...</div>;
  }

  return (
    <div className="company-dashboard">
      <div className="company-page-heading">
        <h1>Company Profile</h1>
        <p>Manage your company information and recruitment details.</p>
      </div>

      <section className="company-panel">
        <h2>Company Information</h2>
        <p>Enter your company details below.</p>

        {message && (
          <p
            role="status"
            style={{
              padding: "12px",
              margin: "12px 0",
              borderRadius: "6px",
              background:
                messageType === "error"
                  ? "#fee2e2"
                  : messageType === "success"
                  ? "#dcfce7"
                  : "#e0f2fe",
              color:
                messageType === "error"
                  ? "#991b1b"
                  : messageType === "success"
                  ? "#166534"
                  : "#075985",
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </p>
        )}

        <div className="company-profile-form">
          <label>
            Company Name *
            <input
              name="companyName"
              value={profile.companyName}
              onChange={updateField}
              required
              placeholder="ABC Technologies"
            />
          </label>

          <label>
            Official Email *
            <input
              name="email"
              type="email"
              value={profile.email}
              onChange={updateField}
              required
              placeholder="hr@example.com"
            />
          </label>

          <label>
            Website
            <input
              name="website"
              type="url"
              value={profile.website}
              onChange={updateField}
              placeholder="https://example.com"
            />
          </label>

          <label>
            Industry *
            <input
              name="industry"
              value={profile.industry}
              onChange={updateField}
              required
              placeholder="Information Technology"
            />
          </label>

          <label>
            Location *
            <input
              name="location"
              value={profile.location}
              onChange={updateField}
              required
              placeholder="Jaipur, Rajasthan"
            />
          </label>

          <label className="company-profile-full">
            Company Description
            <textarea
              name="description"
              value={profile.description}
              onChange={updateField}
              rows={4}
              placeholder="About your company"
            />
          </label>

          <div className="company-profile-full">
            <button
              className="company-save-button"
              type="button"
              disabled={saving}
              onClick={saveProfile}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompanyProfile;
