import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Summarize from "./pages/Summarize";
import Tutor from "./pages/Tutor";

export default function RouterComponent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/summarize" element={<Summarize />} />
      <Route path="/tutor" element={<Tutor />} />
    </Routes>
  );
}
