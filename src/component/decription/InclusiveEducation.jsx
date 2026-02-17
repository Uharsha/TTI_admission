import { useNavigate } from "react-router-dom";

function InclusiveEducation() {
  const navigate = useNavigate();

  const benefits = [
    {
      id: "accessibility",
      icon: "♿",
      title: "Accessibility",
      text: "Fully accessible facilities and learning environments",
    },
    {
      id: "support-system",
      icon: "🤝",
      title: "Support System",
      text: "Dedicated support team for special needs",
    },
    {
      id: "diversity",
      icon: "🌈",
      title: "Diversity",
      text: "Celebrating diversity and inclusive community",
    },
  ];

  return (
    <div id="main" role="main" className="feature-detail-container">
      <div className="feature-detail-card">
        <button className="back-to-home" onClick={() => navigate("/")}>
          ← Back Home
        </button>

        <div className="feature-detail-header">
          <div className="feature-detail-icon">🌍</div>
          <h1 className="feature-detail-title">Inclusive Education</h1>
          <div className="feature-detail-accent"></div>
        </div>

        <div className="feature-detail-content">
          <section className="detail-section">
            <h2>Overview</h2>
            <p>
              We believe education should be accessible to everyone, regardless of background,
              ability, or circumstances. Our inclusive education approach ensures no one is left behind.
            </p>
          </section>

          <section className="detail-section">
            <h2>Our Commitment</h2>
            <ul className="detail-list">
              <li>Accessible learning materials and facilities</li>
              <li>Support for students with disabilities</li>
              <li>Affordable and flexible payment options</li>
              <li>Diverse learning methodologies</li>
              <li>Personalized learning paths</li>
              <li>Scholarship programs for deserving students</li>
            </ul>
          </section>

          <section className="detail-section">
            <h2>Accessibility Features</h2>
            <p>
              We provide assistive technologies, screen readers, and accessible digital platforms
              to ensure every student can learn effectively at their own pace and in their preferred manner.
            </p>
          </section>

          <section className="detail-section">
            <h2>Why Choose Our Inclusive Model</h2>
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
            Join Our Community
          </button>
        </div>
      </div>
    </div>
  );
}

export default InclusiveEducation;

