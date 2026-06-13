import React, { useState } from "react";
import "./style.css";
import axios from "axios";

import Statement from "../Statement/Statement";
import ImageSearch from "../Statement/ImageSearch";
import Voicesearch from "../Statement/Voicesearch";
import Details from "../Details/Details";

const DefaultHome = () => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      // STEP 1: Upload file
      const uploadRes = await axios.post(
        "https://fir-kj8w.onrender.com/api/ocr/upload/",
        formData
      );

      const fileId = uploadRes.data.id;

      // STEP 2: Start background processing
      const startRes = await axios.get(
        `https://fir-kj8w.onrender.com/api/ocr/file/${fileId}/`
      );

      const resultId = startRes.data.result_id;

      // STEP 3: Poll until done
      const maxAttempts = 40;
      let finished = false;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((r) => setTimeout(r, 3000));

        const pollRes = await axios.get(
          `https://fir-kj8w.onrender.com/api/ocr/result/${resultId}/`
        );

        if (pollRes.data.status === "processing") {
          continue;
        }

        if (pollRes.data.status === "error") {
          alert(pollRes.data.error || "Error processing FIR");
          finished = true;
          break;
        }

        setResult(pollRes.data.data);
        finished = true;
        break;
      }

      if (!finished) {
        alert("Processing is taking longer than expected. Please try again.");
      }

    } catch (error) {
      console.error(error);
      alert("Error processing FIR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-gray-800">

        <h1 className="text-3xl font-bold text-blue-500">
          FIR AI
        </h1>

        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl">
          Dashboard
        </button>

      </nav>

      {/* HERO SECTION */}
      <section className="text-center pt-24 px-6">

        <h1 className="text-6xl font-bold leading-tight max-w-5xl mx-auto">
          AI-Powered FIR Analysis System
        </h1>

        <p className="text-gray-400 text-xl mt-8 max-w-3xl mx-auto">
          Automate FIR understanding using OCR, GPT-based legal intelligence,
          multilingual document analysis, and AI-powered summarization.
        </p>

        {/* FILE INPUT */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mt-10 mx-auto block text-white"
        />

        {/* BUTTONS */}
        <div className="flex justify-center gap-6 mt-10">

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg"
          >
            {loading ? "Processing..." : "Upload & Analyze FIR"}
          </button>

          <button className="border border-gray-700 hover:bg-gray-800 px-8 py-4 rounded-xl text-lg">
            View Demo
          </button>

        </div>

        {/* RESULT DISPLAY */}
        {result && (
          <div className="mt-12 bg-gray-900 p-6 rounded-xl max-w-2xl mx-auto text-left">

            <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>

            <p><b>Section:</b> {result.section_identified}</p>
            <p><b>Offence:</b> {result.offence_detected}</p>
            <p><b>Court:</b> {result.court}</p>
            <p><b>Cognizable:</b> {result.is_cognizable ? "Yes" : "No"}</p>
            <p><b>Bailable:</b> {result.is_bailable ? "Yes" : "No"}</p>

          </div>
        )}

      </section>

      {/* FEATURE CARDS */}
      <section className="grid md:grid-cols-3 gap-8 px-10 mt-24">

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            OCR Extraction
          </h2>
          <p className="text-gray-400">
            Extract FIR text from scanned images and PDFs using AI-powered OCR.
          </p>
        </div>

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            Legal Intelligence
          </h2>
          <p className="text-gray-400">
            Automatically identify IPC sections, punishments,
            court types, and legal categories.
          </p>
        </div>

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">
            AI Summarization
          </h2>
          <p className="text-gray-400">
            Generate concise FIR summaries and legal insights
            using GPT-powered language models.
          </p>
        </div>

      </section>

      {/* MAIN WORKFLOW */}
      <section className="mt-28 px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Analyze FIR Documents
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Upload FIRs and generate structured legal insights instantly.
          </p>

        </div>

        <div className="space-y-16">
          <Statement />
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 mt-28 py-10 text-center text-gray-500">

        <p>AI-Powered FIR Analysis System</p>
        <p className="mt-2">OCR • NLP • GPT • Legal Intelligence</p>

      </footer>

    </div>
  );
};

export default DefaultHome;