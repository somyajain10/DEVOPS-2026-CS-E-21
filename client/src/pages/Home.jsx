import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>College Placement Portal</h1>

      <p>
        Find opportunities. Build your career. Get placed.
      </p>

      <button onClick={() => navigate("/login")}>
        Get Started
      </button>
    </div>
  );
}

export default Home;