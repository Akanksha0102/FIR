import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

const handleAnalyze = async () => {
  if (!file) {
    alert("Please select a file first");
    return;
  }

  try {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await axios.post(
      "https://fir-kj8w.onrender.com/api/ocr/upload/",
      formData
    );

    const fileId = uploadRes.data.id;

    const processRes = await axios.get(
      `https://fir-kj8w.onrender.com/api/ocr/file/${fileId}/`
    );

    console.log("FULL RESPONSE:", processRes.data);

    // IMPORTANT FIX
    const data = processRes.data.data || processRes.data;

    if (data.error) {
      alert(data.error);
      return;
    }

    setResult(data);

  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.error ||
      "Server error while processing FIR"
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">

        {/* Upload Section */}
        <div className="pb-28">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              Analyze FIR Documents
            </h2>
          </div>

          <div className="bg-[#111827] p-8 rounded-3xl text-center">

            <input
              type="file"
              onChange={handleFileChange}
              className="mb-6"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 px-6 py-3 rounded-xl"
            >
              {loading ? "Processing..." : "Analyze FIR"}
            </button>

          </div>
        </div>

        {/* RESULTS */}
        {result && (
          <div className="pb-32">
            <h2 className="text-3xl text-center mb-10">
              AI Results
            </h2>

            <div className="space-y-4">

              <p><b>Sections:</b> {result?.section_identified}</p>
              <p><b>Offence:</b> {result?.offence_detected}</p>
              <p><b>Court:</b> {result?.court}</p>
              <p>
                <b>Cognizable:</b> {result?.is_cognizable ? "Yes" : "No"}
              </p>

              <p>
                <b>Explanation:</b>{" "}
                {result?.generated_explanation || result?.generated_explaination}
              </p>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}