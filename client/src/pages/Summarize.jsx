import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPaperclip, FaMicrophone } from "react-icons/fa";

const aiTools = [
  { name: "Summarizer", active: true, avatar: "🧠" },
  { name: "Essay Helper", active: false, avatar: "✍️", comingSoon: true },
  { name: "Translation AI", active: false, avatar: "🌐", comingSoon: true },
  { name: "Flashcard Generator", active: false, avatar: "🧾", comingSoon: true },
  { name: "Formula Solver", active: false, avatar: "🔢", comingSoon: true },
  { name: "Code Explainer", active: false, avatar: "💡", comingSoon: true },
];

export default function Summarize() {
  const [selectedTool, setSelectedTool] = useState(aiTools[0]);
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [files, setFiles] = useState([]);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const handleSummarize = async () => {
    if (!notes.trim()) return;

    setShowFullSummary(false);
    setSummary("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/summarize", {
        text: notes,
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing:", error);
      setSummary("❌ Failed to summarize notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!summary) return;
    import("jspdf").then((jsPDF) => {
      const doc = new jsPDF.jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxLineWidth = pageWidth - margin * 2;
      const lines = doc.splitTextToSize(summary, maxLineWidth);
      doc.text(lines, margin, 20);
      doc.save("summary.pdf");
    });
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

  const TypingDots = () => {
    const [dots, setDots] = useState("");
    useEffect(() => {
      if (!loading) return;
      const interval = setInterval(() => {
        setDots((d) => (d.length >= 3 ? "" : d + "."));
      }, 500);
      return () => clearInterval(interval);
    }, [loading]);

    return <span>{dots}</span>;
  };

  return (
    <div
      className="container-fluid mt-4 shadow rounded"
      style={{
        maxWidth: "1300px",
        height: "90vh",
        display: "flex",
        border: "1px solid #dee2e6",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Left Sidebar */}
      <div
        className="border-end p-3"
        style={{
          width: "300px",
          background: "#f8f9fa",
          overflowY: "auto",
        }}
      >
        <h5 className="mb-4 text-center">🛠 AI Tools</h5>
        {aiTools.map((tool, index) => (
          <div
            key={index}
            className={`d-flex justify-content-between align-items-center p-2 mb-2 rounded ${
              selectedTool.name === tool.name ? "bg-primary text-white" : "bg-white"
            }`}
            style={{
              border: "1px solid #dee2e6",
              cursor: tool.comingSoon ? "not-allowed" : "pointer",
              opacity: tool.comingSoon ? 0.6 : 1,
            }}
            onClick={() => {
              if (!tool.comingSoon) setSelectedTool(tool);
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
                {tool.avatar}
              </div>
              <div>{tool.name}</div>
            </div>
            {tool.comingSoon && (
              <span className="badge bg-secondary text-white">Coming Soon</span>
            )}
          </div>
        ))}
      </div>

      {/* Right: Chat Interface */}
      <div className="d-flex flex-column flex-grow-1">
        {/* Header */}
        <div className="border-bottom p-3 bg-light">
          <strong>{selectedTool.name}</strong>
        </div>

        {/* Chat area */}
        <div
          className="flex-grow-1 p-3"
          style={{
            overflowY: "auto",
            background: "#f9f9f9",
          }}
        >
          {/* Input bubble */}
          {notes && (
            <div className="d-flex justify-content-end mb-3">
              <div
                className="bg-primary text-white p-3 rounded"
                style={{
                  maxWidth: "70%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {notes}
              </div>
            </div>
          )}

          {/* AI response */}
          {summary || loading ? (
            <div className="d-flex justify-content-start">
              <div
                className="bg-light border p-3 rounded"
                style={{
                  maxWidth: "70%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {loading ? (
                  <>
                    Summarizing<span><TypingDots /></span>
                  </>
                ) : (
                  <>
                    {showFullSummary || summary.length <= 300
                      ? summary
                      : summary.slice(0, 300) + "... "}
                    {summary.length > 300 && (
                      <button
                        className="btn btn-link p-0 ms-1"
                        style={{ fontSize: "0.9rem" }}
                        onClick={() => setShowFullSummary(!showFullSummary)}
                      >
                        {showFullSummary ? "Show Less" : "View More"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* File preview */}
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

        {/* Input area */}
        <div className="p-3 border-top bg-white d-flex align-items-center" style={{ flexWrap: "nowrap" }}>
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

          <textarea
            className="form-control me-2"
            placeholder="Paste your class notes here..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />

          <button
            className="btn btn-success me-2"
            disabled={loading || !notes.trim()}
            onClick={handleSummarize}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          <button
            className="btn btn-outline-success"
            onClick={handleDownloadPDF}
            disabled={!summary || loading}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
