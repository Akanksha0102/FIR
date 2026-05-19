import React, { useState } from "react";
import axios from "axios";

const Statement = () => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle FIR Upload + Processing
  const handleProcess = async () => {

    if (!file) {
      alert("Please upload an FIR file");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      // Upload FIR
      await axios.post(
        "https://fir-kj8w.onrender.com/api/ocr/upload/",
        formData
      );

      // Process FIR
      const response = await axios.get(
        "https://fir-kj8w.onrender.com/api/ocr/process/"
      );

      console.log(response.data);

      setResult(response.data);

    } catch (error) {

      console.error(error);
      alert("Error processing FIR");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="max-w-6xl mx-auto">

      {/* Upload Box */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">

        <h2 className="text-4xl font-bold text-center mb-6">
          Upload FIR Document
        </h2>

        <p className="text-gray-400 text-center mb-10">
          Upload scanned FIR images or PDFs for AI-powered legal analysis.
        </p>

        {/* File Input */}
        <div className="flex flex-col items-center">

          <input
            type="file"
            onChange={handleFileChange}
            className="mb-6 text-white"
          />

          <button
            onClick={handleProcess}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg"
          >
            Analyze FIR
          </button>

        </div>

        {/* Selected File */}
        {file && (

          <div className="mt-6 text-center text-gray-400">
            Selected File: {file.name}
          </div>

        )}

      </div>

      {/* Loader */}
      {loading && (

        <div className="mt-10 text-center text-blue-400 text-xl animate-pulse">

          Running OCR + GPT Legal Analysis...

        </div>

      )}

      {/* AI Results */}
      {result && (

        <div className="grid md:grid-cols-2 gap-6 mt-16">

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-3">
              IPC Section
            </h3>

            <p>{result.section_identified}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-3">
              Offence
            </h3>

            <p>{result.offence_detected}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-3">
              Punishment
            </h3>

            <p>{result.punishment}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-3">
              Court
            </h3>

            <p>{result.court}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-3">
              Cognizable
            </h3>

            <p>
              {result.is_cognizable ? "Yes" : "No"}
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-3">
              Bailable
            </h3>

            <p>
              {result.is_bailable ? "Yes" : "No"}
            </p>
          </div>

        </div>

      )}

    </div>
  );
};

export default Statement;