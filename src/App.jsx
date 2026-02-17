
// import './App.css'
// import AdmissionForm from './component/AdimssoinForm'

// function App() {

//   return (
//     <>
//      <div className="graph-bg"></div>
//      <div className="data-wave"></div>
//     <AdmissionForm />
    
//     </>
  
//  )
// }

// export default App


import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TTIDescription from "./component/decription/TTIDescription";
import AdmissionForm from "./component/AdimssoinForm";
import PracticalTraining from "./component/decription/PracticalTraining";
import CareerFocused from "./component/decription/CareerFocused";
import InclusiveEducation from "./component/decription/InclusiveEducation";
import BenefitDetail from "./component/decription/BenefitDetail";
import './App.css'
import Rules from "./component/data/Rules";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<TTIDescription />} />
        <Route path="/register" element={<AdmissionForm />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/practical-training" element={<PracticalTraining />} />
        <Route path="/career-focused" element={<CareerFocused />} />
        <Route path="/inclusive-education" element={<InclusiveEducation />} />
        <Route path="/benefits/:benefitId" element={<BenefitDetail />} />
      </Routes>
    </>
  );
}

export default App;
