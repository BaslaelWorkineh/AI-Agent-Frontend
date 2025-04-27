import { useAuth } from '@clerk/clerk-react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../Landing.css"; // We'll define the CSS in a separate file

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handleSignIn = () => {
    navigate("/dashboard");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <>
      <nav className="nav">
        <a href="/" className="logo">
          <div className="logo-icon">T</div>
          <div className="logo-text">TINA</div>
        </a>
        <div className="auth-buttons">
          <NavLink to="/docs" className="sign-in-btn">Docs</NavLink>
          {isSignedIn ? (
            <button className="sign-in-btn" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          ) : (
            <>
              <button className="sign-in-btn" onClick={handleSignIn}>
                Sign In
              </button>
              <button className="sign-up-btn" onClick={handleSignUp}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1 className="headline">
          Meet TINA, Your <br />AI Executive Assistant
        </h1>
        <p className="subheadline">
          Streamline your workflow with intelligent email management, smart calendar
          scheduling, and automated task organization — all in one place.
        </p>
        <button className="cta-btn" onClick={handleGetStarted}>
          Get Started — It's Free
        </button>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📧</div>
          <h3 className="feature-title">Smart Email Management</h3>
          <p className="feature-desc">
            TINA prioritizes your emails and creates actionable tasks
            automatically, cutting your inbox management time by 70%.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3 className="feature-title">Intelligent Scheduling</h3>
          <p className="feature-desc">
            Schedule meetings effortlessly with AI that understands your
            preferences and optimizes your calendar for productivity.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✓</div>
          <h3 className="feature-title">Task Automation</h3>
          <p className="feature-desc">
            Convert conversations into tasks, set smart reminders, and let TINA
            handle follow-ups so nothing falls through the cracks.
          </p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 TINA AI Assistant. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Landing;