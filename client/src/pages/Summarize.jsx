import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Summarize() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const summaryRef = useRef(null);

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

    // Create a simple PDF with summary text using jsPDF
    import("jspdf").then((jsPDF) => {
      const doc = new jsPDF.jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxLineWidth = pageWidth - margin * 2;
      const text = summary;
      const lines = doc.splitTextToSize(text, maxLineWidth);
      doc.text(lines, margin, 20);
      doc.save("summary.pdf");
    });
  };

  // Animate typing dots while loading
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
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">🧠 AI Note Summarizer</h2>

      {/* Chat container */}
      <div
        className="border rounded p-3 mb-3"
        style={{ minHeight: "300px", backgroundColor: "#f8f9fa" }}
      >
        {/* User input bubble */}
        <div className="d-flex justify-content-end mb-3">
          <div
            style={{
              backgroundColor: "#0d6efd",
              color: "#fff",
              padding: "10px 15px",
              borderRadius: "15px 15px 0 15px",
              maxWidth: "70%",
              whiteSpace: "pre-wrap",
            }}
          >
            {notes || "Your notes will appear here..."}
          </div>
        </div>

        {/* Summary / AI bubble */}
        <div className="d-flex justify-content-start">
          <div
            style={{
              backgroundColor: "#e9ecef",
              color: "#212529",
              padding: "10px 15px",
              borderRadius: "15px 15px 15px 0",
              maxWidth: "70%",
              whiteSpace: "pre-wrap",
              minHeight: "50px",
              position: "relative",
              fontStyle: loading ? "italic" : "normal",
            }}
            ref={summaryRef}
          >
            {loading ? (
              <>
                Summarizing<span><TypingDots /></span>
              </>
            ) : summary ? (
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
            ) : (
              "Summary will appear here..."
            )}
          </div>
        </div>
      </div>

      {/* Input area */}
      <textarea
        className="form-control mb-3"
        rows={5}
        placeholder="Paste your class notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={loading}
      />

      <div className="d-flex gap-2">
        <button
          className="btn btn-primary flex-grow-1"
          onClick={handleSummarize}
          disabled={loading || !notes.trim()}
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
  );
}
