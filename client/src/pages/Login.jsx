import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "student") {
      navigate("/student");
    } else if (role === "company") {
      navigate("/company");
    } else if (role === "admin") {
      navigate("/admin");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <label>Select Role</label>
        <br />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="company">Company</option>
          <option value="admin">Admin</option>
        </select>

        <br />
        <br />

        <label>Email</label>
        <br />
        <input type="email" required />

        <br />
        <br />

        <label>Password</label>
        <br />
        <input type="password" required />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;