import React, { useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPaperclip, FaMicrophone } from "react-icons/fa";

const aiList = [
  { name: "Maths AI", active: true, avatar: "📐" },
  { name: "Accounting AI", active: false, avatar: "📊", comingSoon: true },
  { name: "Devices AI", active: false, avatar: "💻", comingSoon: true },
];

export default function Tutor() {
  const [selectedAI, setSelectedAI] = useState(aiList[0]);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const handleAsk = async () => {
    if (!question.trim() && files.length === 0) return;

    const userMsg = { type: "user", text: question };
    setChatHistory((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    const formData = new FormData();
    formData.append("message", question);
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("http://localhost:5000/api/tutor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const aiMsg = { type: "ai", text: response.data.reply };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errMsg = { type: "ai", text: "❌ Failed to get an answer. Please try again." };
      setChatHistory((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setFiles([]);
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });
        setFiles((prev) => [...prev, audioFile]);
        audioChunks.current = [];
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div
      className="container-fluid mt-4 shadow rounded"
      style={{
        maxWidth: "1000px",
        height: "90vh",
        display: "flex",
        border: "1px solid #dee2e6",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Left: AI List */}
      <div
        className="border-end p-3"
        style={{
          width: "280px",
          background: "#f8f9fa",
          overflowY: "auto",
        }}
      >
        <h5 className="mb-4 text-center">🤖 AI Tutors</h5>
        {aiList.map((ai, index) => (
          <div
            key={index}
            className={`d-flex justify-content-between align-items-center p-2 mb-2 rounded ${
              selectedAI.name === ai.name ? "bg-primary text-white" : "bg-white"
            }`}
            style={{
              border: "1px solid #dee2e6",
              cursor: ai.comingSoon ? "not-allowed" : "pointer",
              opacity: ai.comingSoon ? 0.6 : 1,
            }}
            onClick={() => {
              if (!ai.comingSoon) setSelectedAI(ai);
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="me-3 rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: "35px",
                  height: "35px",
                  background: "#e0e0e0",
                  fontSize: "18px",
                }}
              >
                {ai.avatar}
              </div>
              <div>{ai.name}</div>
            </div>
            {ai.comingSoon && (
              <span className="badge bg-secondary text-white">Coming Soon</span>
            )}
          </div>
        ))}
      </div>

      {/* Right: Chat Interface */}
      <div className="d-flex flex-column flex-grow-1">
        {/* Header */}
        <div className="border-bottom p-3 bg-light">
          <strong>Chat with {selectedAI.name}</strong>
        </div>

        {/* Chat Body */}
        <div
          className="flex-grow-1 p-3"
          style={{
            overflowY: "auto",
            background: "#f9f9f9",
          }}
        >
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex mb-3 ${
                msg.type === "user" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded ${
                  msg.type === "user" ? "bg-primary text-white" : "bg-light border"
                }`}
                style={{
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* File Previews */}
        {files.length > 0 && (
          <div className="px-3 py-2 border-top bg-light small text-muted">
            <strong>Attached:</strong>{" "}
            {files.map((file, i) => (
              <span key={i} className="me-2">
                📎 {file.name}
              </span>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div
          className="p-3 border-top bg-white d-flex align-items-center"
          style={{ flexWrap: "nowrap" }}
        >
          <label htmlFor="file-upload" className="btn btn-outline-secondary me-2 mb-0">
            <FaPaperclip />
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.gif,.png,.jpg,.jpeg,.mp4,.mp3,.wav,.webm"
            style={{ display: "none" }}
          />

          <button
            className={`btn btn-outline-secondary me-2 ${recording ? "text-danger" : ""}`}
            onClick={recording ? stopRecording : startRecording}
            title={recording ? "Stop Recording" : "Start Recording"}
          >
            <FaMicrophone />
          </button>

          <input
            className="form-control me-2"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />

          <button
            className="btn btn-success"
            disabled={loading || (!question.trim() && files.length === 0)}
            onClick={handleAsk}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
