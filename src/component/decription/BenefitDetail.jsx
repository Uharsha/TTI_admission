import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BENEFIT_DETAILS = {
  "fast-learning": {
    icon: "⚡",
    title: "Fast Learning",
    program: "Practical Training",
    description:
      "Accelerated modules that help students gain practical skills in a short duration.",
    highlights: [
      "4-week intensive learning track",
      "Daily guided practice sessions",
      "Weekly progress checkpoints",
      "Doubt-clearing mentorship support",
    ],
    outcomes: [
      "Build confidence in tools quickly",
      "Complete first portfolio assignment fast",
      "Improve execution speed for tasks",
    ],
  },
  "goal-oriented": {
    icon: "🎯",
    title: "Goal-Oriented",
    program: "Practical Training",
    description:
      "Every module is mapped to a clear objective so students know exactly what they are working toward.",
    highlights: [
      "Milestone-based course planning",
      "Trackable weekly targets",
      "Role-based project assignments",
      "Structured mentor feedback loops",
    ],
    outcomes: [
      "Clear direction in learning journey",
      "Reduced confusion and rework",
      "Stronger goal completion discipline",
    ],
  },
  "expert-guidance": {
    icon: "👨‍💼",
    title: "Expert Guidance",
    program: "Practical Training",
    description:
      "Students learn directly from experienced trainers with real project exposure.",
    highlights: [
      "Mentor-led live sessions",
      "Real industry case study walkthroughs",
      "One-on-one feedback for projects",
      "Interview-focused guidance support",
    ],
    outcomes: [
      "Better problem-solving approach",
      "Professional workflow understanding",
      "Improved interview readiness",
    ],
  },
  "skill-enhancement": {
    icon: "📈",
    title: "Skill Enhancement",
    program: "Career Focused",
    description:
      "Focused upskilling modules help students strengthen technical and workplace-ready abilities.",
    highlights: [
      "In-demand tool coverage",
      "Hands-on assignments after each concept",
      "Skill-gap based practice plans",
      "Domain-relevant mini projects",
    ],
    outcomes: [
      "Higher confidence in job roles",
      "Improved technical command",
      "Stronger practical portfolio",
    ],
  },
  "job-placement": {
    icon: "🏢",
    title: "Job Placement",
    program: "Career Focused",
    description:
      "Structured placement support is provided through mock interviews and profile readiness.",
    highlights: [
      "Resume and LinkedIn polishing",
      "Mock HR and technical interviews",
      "Employer network opportunities",
      "Job application strategy sessions",
    ],
    outcomes: [
      "Better interview performance",
      "Higher selection probability",
      "Faster transition to employment",
    ],
  },
  "career-growth": {
    icon: "💡",
    title: "Career Growth",
    program: "Career Focused",
    description:
      "Students receive long-term growth direction beyond immediate job placement.",
    highlights: [
      "Career roadmap planning",
      "Professional communication support",
      "Workplace readiness coaching",
      "Continuous development checkpoints",
    ],
    outcomes: [
      "Clear long-term progression path",
      "Better adaptability to new roles",
      "Sustained professional growth",
    ],
  },
  accessibility: {
    icon: "♿",
    title: "Accessibility",
    program: "Inclusive Education",
    description:
      "Learning environment is designed to be accessible and comfortable for all students.",
    highlights: [
      "Accessible classroom arrangements",
      "Assistive learning support tools",
      "Screen reader-friendly content",
      "Flexible learning pace options",
    ],
    outcomes: [
      "Reduced barriers to learning",
      "Higher classroom participation",
      "Inclusive and supportive experience",
    ],
  },
  "support-system": {
    icon: "🤝",
    title: "Support System",
    program: "Inclusive Education",
    description:
      "Dedicated support team assists students with guidance, counseling, and academic help.",
    highlights: [
      "Mentor + counselor support model",
      "Regular wellbeing check-ins",
      "Parent/guardian communication touchpoints",
      "Academic assistance for special needs",
    ],
    outcomes: [
      "Better consistency in learning",
      "Higher motivation and retention",
      "Safer and more confident student journey",
    ],
  },
  diversity: {
    icon: "🌈",
    title: "Diversity",
    program: "Inclusive Education",
    description:
      "A respectful multi-background learning community where every student is valued.",
    highlights: [
      "Inclusive classroom culture",
      "Respect-focused peer collaboration",
      "Equal opportunity participation",
      "Community-oriented learning activities",
    ],
    outcomes: [
      "Improved teamwork and empathy",
      "Healthy and welcoming learning space",
      "Stronger sense of belonging",
    ],
  },
};

function BenefitDetail() {
  const { benefitId } = useParams();
  const navigate = useNavigate();

  const benefit = useMemo(() => BENEFIT_DETAILS[benefitId] || null, [benefitId]);

  return (
    <div id="main" role="main" className="feature-detail-container">
      <div className="feature-detail-card">
        <button className="back-to-home" onClick={() => navigate("/")}>
          ← Back Home
        </button>

        {!benefit ? (
          <div className="feature-detail-content">
            <section className="detail-section">
              <h2>Benefit not found</h2>
              <p>Please go back and choose a valid benefit.</p>
            </section>
          </div>
        ) : (
          <div className="feature-detail-content">
            <div className="feature-detail-header">
              <div className="feature-detail-icon">{benefit.icon}</div>
              <h1 className="feature-detail-title">{benefit.title}</h1>
              <div className="feature-detail-accent"></div>
            </div>

            <section className="detail-section">
              <h2>Overview</h2>
              <p>{benefit.description}</p>
            </section>

            <section className="detail-section">
              <h2>Program Context</h2>
              <p>
                This benefit is part of our <b>{benefit.program}</b> track.
              </p>
            </section>

            <section className="detail-section">
              <h2>What You Get</h2>
              <ul className="detail-list">
                {benefit.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <button className="btn-enroll" onClick={() => navigate("/register")}>
              Enroll Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BenefitDetail;
