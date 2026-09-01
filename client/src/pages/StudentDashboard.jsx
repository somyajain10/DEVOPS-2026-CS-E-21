function StudentDashboard() {
  return (
    <div>
      <h1>Welcome back, Student! 👋</h1>
      <p>Here's an overview of your placement journey.</p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Applications</h3>
          <h2>0</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Eligible Companies</h3>
          <h2>0</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Profile Status</h3>
          <h2>Incomplete</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Contest Score</h3>
          <h2>--</h2>
        </div>
      </div>

      <div
        style={{
          background: "white",
          marginTop: "30px",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Placement Status</h2>

        <p>
          Complete your profile and upload your resume to start applying for
          placement opportunities.
        </p>

        <button
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Complete Profile
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;