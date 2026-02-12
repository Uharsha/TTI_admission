import { useNavigate } from "react-router-dom";

function TTIDescription() {
  const navigate = useNavigate();

  const features = [
    {
      id: "practical",
      icon: "📚",
      title: "Practical Training",
      subtitle: "Hands-on learning experience",
      path: "/practical-training",
      color: "#38bdf8"
    },
    {
      id: "career",
      icon: "💼",
      title: "Career Focused",
      subtitle: "Industry-aligned curriculum",
      path: "/career-focused",
      color: "#22d3ee"
    },
    {
      id: "inclusive",
      icon: "🌍",
      title: "Inclusive Education",
      subtitle: "Accessible for everyone",
      path: "/inclusive-education",
      color: "#06b6d4"
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <div id="main" role="main" className="description-container">
      <div className="description-card">
        <div className="description-header">
          <h1 className="description-title">TTI Foundation</h1>
          <p className="description-subtitle">Technical Training Institute of PBMA</p>
          <div className="title-accent"></div>
        </div>

        <div className="description-content">
          <p className="description-text">
            TTI Foundation is a premier skill development institute focused on providing practical,
            career-oriented, and inclusive education. We empower individuals with industry-relevant
            skills to excel in their professional journeys.
          </p>
          
          <div className="features-grid">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="feature-item"
                onClick={() => handleFeatureClick(feature.path)}
                role="button"
                tabIndex="0"
                aria-label={`Open ${feature.title} details - ${feature.subtitle}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleFeatureClick(feature.path);
                }}
              >
                <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
                <span className="feature-title">{feature.title}</span>
                <span className="feature-subtitle">{feature.subtitle}</span>
                <div className="feature-arrow" aria-hidden="true">→</div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-register" aria-label="Register for courses" onClick={() => navigate("/register")}>
          Register Now
        </button>
      </div>
    </div>
  );
}

export default TTIDescription;

