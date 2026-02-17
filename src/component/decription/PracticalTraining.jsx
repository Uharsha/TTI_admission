import { useNavigate } from "react-router-dom";

function PracticalTraining() {
  const navigate = useNavigate();

  const benefits = [
    {
      id: "fast-learning",
      icon: "⚡",
      title: "Fast Learning",
      text: "Accelerated programs designed for quick skill acquisition",
    },
    {
      id: "goal-oriented",
      icon: "🎯",
      title: "Goal-Oriented",
      text: "Clear objectives and outcomes for each course",
    },
    {
      id: "expert-guidance",
      icon: "👨‍💼",
      title: "Expert Guidance",
      text: "Learn from industry experts and experienced trainers",
    },
  ];

  return (
    <div id="main" role="main" className="feature-detail-container">
      <div className="feature-detail-card">
        <button className="back-to-home" onClick={() => navigate("/")}>
          ← Back Home
        </button>

        <div className="feature-detail-header">
          <div className="feature-detail-icon">📚</div>
          <h1 className="feature-detail-title">Practical Training</h1>
          <div className="feature-detail-accent"></div>
        </div>

        <div className="feature-detail-content">
          <section className="detail-section">
            <h2>Overview</h2>
            <p>
              Our practical training programs are designed to equip students with
              real-world skills and hands-on experience needed in today's competitive job market.
            </p>
          </section>

          <section className="detail-section">
            <h2>What We Offer</h2>
            <ul className="detail-list">
              <li>Hands-on lab experience with industry-standard tools</li>
              <li>Real-world projects and case studies</li>
              <li>Mentorship from experienced professionals</li>
              <li>Industry partnerships and internships</li>
              <li>Certification upon completion</li>
            </ul>
          </section>

          <section className="detail-section">
            <h2>Our Approach</h2>
            <p>
              We believe in learning by doing. Our trainers guide you through practical
              exercises, projects, and real-world scenarios to ensure you gain practical
              knowledge that can be immediately applied in your career.
            </p>
          </section>

          <section className="detail-section">
            <h2>Benefits</h2>
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
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PracticalTraining;


