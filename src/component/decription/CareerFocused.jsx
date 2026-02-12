import { useNavigate } from "react-router-dom";

function CareerFocused() {
  const navigate = useNavigate();

  return (
    <div id="main" role="main" className="feature-detail-container">
      <div className="feature-detail-card">
        <button className="back-to-home" onClick={() => navigate("/")}>
          ← Back Home
        </button>

        <div className="feature-detail-header">
          <div className="feature-detail-icon">💼</div>
          <h1 className="feature-detail-title">Career Focused</h1>
          <div className="feature-detail-accent"></div>
        </div>

        <div className="feature-detail-content">
          <section className="detail-section">
            <h2>Overview</h2>
            <p>
              Our career-focused programs are meticulously designed to align with industry
              demands and prepare you for sustainable career growth and advancement.
            </p>
          </section>

          <section className="detail-section">
            <h2>Career Support Services</h2>
            <ul className="detail-list">
              <li>Resume building and optimization</li>
              <li>Interview preparation and coaching</li>
              <li>Job placement assistance</li>
              <li>Networking opportunities with employers</li>
              <li>Career counseling and guidance</li>
              <li>LinkedIn profile optimization</li>
            </ul>
          </section>

          <section className="detail-section">
            <h2>Industry Alignment</h2>
            <p>
              Our curriculum is updated regularly based on industry feedback and market trends.
              We ensure that every skill we teach is in high demand and will boost your career prospects.
            </p>
          </section>

          <section className="detail-section">
            <h2>Career Outcomes</h2>
            <div className="benefits-grid">
              <div className="benefit-box">
                <div className="benefit-icon">📈</div>
                <h3>Skill Enhancement</h3>
                <p>Master in-demand skills for career advancement</p>
              </div>
              <div className="benefit-box">
                <div className="benefit-icon">🏢</div>
                <h3>Job Placement</h3>
                <p>Strong track record of successful placements</p>
              </div>
              <div className="benefit-box">
                <div className="benefit-icon">💡</div>
                <h3>Career Growth</h3>
                <p>Long-term career development strategies</p>
              </div>
            </div>
          </section>

          <button className="btn-enroll" onClick={() => navigate("/register")}>
            Start Your Career Journey
          </button>
        </div>
      </div>
    </div>
  );
}

export default CareerFocused;
