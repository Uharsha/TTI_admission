import { useNavigate } from "react-router-dom";

function CareerFocused() {
  const navigate = useNavigate();

  const benefits = [
    {
      id: "skill-enhancement",
      icon: "📈",
      title: "Skill Enhancement",
      text: "Master in-demand skills for career advancement",
    },
    {
      id: "job-placement",
      icon: "🏢",
      title: "Job Placement",
      text: "Strong track record of successful placements",
    },
    {
      id: "career-growth",
      icon: "💡",
      title: "Career Growth",
      text: "Long-term career development strategies",
    },
  ];

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
              {benefits.map((item) => (
                <div
                  key={item.id}
                  className="benefit-box"
                  role="button"
                  tabIndex="0"
                  onClick={() => navigate(`/benefits/${item.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(`/benefits/${item.id}`);
                    }
                  }}
                >
                  <div className="benefit-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
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

