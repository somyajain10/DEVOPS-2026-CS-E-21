import { useState } from "react";

function AdminCompanies() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "TCS",
      email: "hr@tcs.com",
      industry: "IT Services",
      location: "Pune",
      status: "Active",
    },
    {
      id: 2,
      name: "Infosys",
      email: "careers@infosys.com",
      industry: "IT Services",
      location: "Bangalore",
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    industry: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCompany = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.industry || !form.location) {
      alert("Please fill all fields.");
      return;
    }

    const newCompany = {
      id: Date.now(),
      ...form,
      status: "Active",
    };

    setCompanies([...companies, newCompany]);

    setForm({
      name: "",
      email: "",
      industry: "",
      location: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter((company) => company.id !== id));
    }
  };

  const filteredCompanies = companies.filter((company) =>
    `${company.name} ${company.email} ${company.industry} ${company.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Companies</h1>
          <p>Add and manage companies registered for placements.</p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Company"}
        </button>
      </div>

      {showForm && (
        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h2>Add Company</h2>
              <p>Enter recruiter/company details.</p>
            </div>
          </div>

          <form className="admin-form" onSubmit={handleAddCompany}>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label>HR Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hr@company.com"
              />
            </div>

            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="IT Services"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Bangalore"
              />
            </div>

            <button type="submit" className="admin-primary-button">
              Save Company
            </button>

          </form>
        </div>
      )}

      <div className="admin-panel">

        <div className="admin-toolbar">
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
          />
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <h3>No companies found</h3>
            <p>Add a company or change your search.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id}>

                    <td>
                      <strong>{company.name}</strong>
                    </td>

                    <td>{company.email}</td>

                    <td>{company.industry}</td>

                    <td>{company.location}</td>

                    <td>
                      <span className="status-badge">
                        {company.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-button danger"
                        onClick={() => handleDelete(company.id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminCompanies;