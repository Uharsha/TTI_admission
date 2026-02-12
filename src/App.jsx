
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


import { Routes, Route } from "react-router-dom";
import TTIDescription from "./component/decription/TTIDescription";
import AdmissionForm from "./component/AdimssoinForm";
import PracticalTraining from "./component/decription/PracticalTraining";
import CareerFocused from "./component/decription/CareerFocused";
import InclusiveEducation from "./component/decription/InclusiveEducation";
import './App.css'
import Rules from "./component/data/Rules";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<TTIDescription />} /> */}
      <Route path="/" element={<AdmissionForm />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/practical-training" element={<PracticalTraining />} />
      <Route path="/career-focused" element={<CareerFocused />} />
      <Route path="/inclusive-education" element={<InclusiveEducation />} />
    </Routes>
  );
}

export default App;
