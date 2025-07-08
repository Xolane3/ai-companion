import React from "react";

export default function Home() {
  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-3 fw-bold">Welcome to AI Study Companion</h1>
        <p className="lead text-secondary">
          Your smart assistant for summarizing notes, chatting with tutors, and enhancing your study sessions with AI.
        </p>
      </header>

      {/* Features Section */}
      <section className="mb-5">
        <h2 className="mb-4 text-center">Features</h2>
        <div className="row g-4">
          <div className="col-md-4 text-center">
            <div className="p-4 border rounded shadow-sm h-100">
              <div className="fs-1 mb-3">📝</div>
              <h4>Note Summarizer</h4>
              <p>Paste your class notes and get concise AI-generated summaries instantly.</p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="p-4 border rounded shadow-sm h-100">
              <div className="fs-1 mb-3">💬</div>
              <h4>Tutor Chat</h4>
              <p>Chat with an AI-powered tutor to ask questions and get explanations anytime.</p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="p-4 border rounded shadow-sm h-100">
              <div className="fs-1 mb-3">📚</div>
              <h4>Study Planner</h4>
              <p>Organize your study schedule and keep track of your progress efficiently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h3 className="mb-4">Get Started Now</h3>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button className="btn btn-primary btn-lg px-4 shadow-sm">Summarize Notes</button>
          <button className="btn btn-success btn-lg px-4 shadow-sm">Chat with Tutor</button>
          <button className="btn btn-outline-secondary btn-lg px-4 shadow-sm">Learn More</button>
        </div>
      </section>
    </div>
  );
}
