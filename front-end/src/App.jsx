import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from './components/Footer';
import StudentDashboard from "./pages/Student-Dashboard";
import LectureDashboard from "./pages/Lecture-Dashboard";
import LectureReportingForm from "./pages/Lecture-Reporting-form";
import PrincipalLecture from "./pages/Principal-Lecture";
import ProgramLeader from "./pages/Program-Leader";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {

  return (

    <>
    <BrowserRouter>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <div style={{ flexGrow: 1 }}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/lecture-dashboard" element={<LectureDashboard />} />
      <Route path="/lecture-reporting-form" element={<LectureReportingForm />} />
      <Route path="/principal-lecture" element={<PrincipalLecture />} />
      <Route path="/program-leader" element={<ProgramLeader />} />
    </Routes>
    </div>
    <Footer />
    </div>
    </BrowserRouter>
    </>
  );
}

export default App;