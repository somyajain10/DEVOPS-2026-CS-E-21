import { useEffect, useState } from "react";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://devops-2026-cs-e-21.onrender.com/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Students</h1>
          <p>View and manage registered students.</p>
        </div>
      </div>

      <div className="admin-panel">

        {loading ? (
          <div className="empty-state">
            <h3>Loading students...</h3>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍🎓</div>

            <h3>No students found</h3>

            <p>
              Registered students will appear here.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>

                    <td>{student.name}</td>

                    <td>{student.email}</td>

                    <td>{student.role}</td>

                    <td>
                      <button
                        className="table-button"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

      {selectedStudent && (
        <div className="admin-panel" aria-labelledby="student-details-title">
          <div className="panel-header">
            <h2 id="student-details-title">Student Details</h2>
            <button
              className="table-button"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
          <p><strong>Name:</strong> {selectedStudent.name || "—"}</p>
          <p><strong>Email:</strong> {selectedStudent.email || "—"}</p>
          <p><strong>Role:</strong> {selectedStudent.role || "—"}</p>
          {selectedStudent.createdAt && (
            <p>
              <strong>Registered:</strong>{" "}
              {new Date(selectedStudent.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

    </div>
  );
}

export default AdminStudents;
