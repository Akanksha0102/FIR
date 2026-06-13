import React, { useState, useEffect } from "react";
import axios from "axios";
import { tabData } from "./Tabs_Data";
import { thumb } from "../../assets/images";
import Design_copmponent from "../design_componet/opacity";
import "./style.css";

const Gallery = ({ activeTab, fileId }) => {
  const [showDetails, SetDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      if (!fileId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `https://fir-kj8w.onrender.com/api/ocr/file/${fileId}/`
        );

        console.log("API RESPONSE:", res.data);
        SetDetails(res.data);
      } catch (err) {
        console.log("error:", err);
        setError("Failed to fetch FIR details");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [fileId]);

  const filteredData = tabData;

  return (
    <div>
      {loading && <p className="text-white">Processing FIR...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {showDetails && (
        <div className="p-4 text-white">
          <h2 className="text-2xl font-bold mb-4">FIR Generated Result</h2>

          <p>
            <b>Section Identified:</b>{" "}
            {showDetails.data?.section_identified}
          </p>

          <p>
            <b>Offence Detected:</b>{" "}
            {showDetails.data?.offence_detected}
          </p>

          <p>
            <b>Explanation:</b>{" "}
            {showDetails.data?.generated_explanation}
          </p>

          <p>
            <b>Punishment:</b> {showDetails.data?.punishment}
          </p>

          <p>
            <b>Court:</b> {showDetails.data?.court}
          </p>

          <p>
            <b>Cognizable:</b>{" "}
            {String(showDetails.data?.is_cognizable)}
          </p>

          <p>
            <b>Bailable:</b> {String(showDetails.data?.is_bailable)}
          </p>
        </div>
      )}

      {/* Static UI section (your existing design) */}
      {filteredData.map((data, index) => (
        <div key={index} className="flex flex-rows p-3">
          <img
            src={thumb}
            alt="thumb"
            className="w-1/4 h-1/2 object-contain mx-3"
            style={{ maxWidth: "33%", maxHeight: "33%" }}
          />

          <div className="flex flex-col gap-8 text-white">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">
              Details
            </h1>

            <p>{data.Fir?.FIR?.DetailsOfAccused}</p>
            <p>Description: {data.Fir?.FIR?.Description}</p>

            <div className="text-xl font-bold">Sections:</div>

            <p>Act: {data.Fir?.FIR?.Act}</p>
            <p>Cognizable: {String(data.Fir?.FIR?.Cognizable)}</p>
            <p>Bailable: {String(data.Fir?.FIR?.Bailable)}</p>
          </div>
        </div>
      ))}

      <div className="py-4 mt-4 text-white">
        <Design_copmponent />
      </div>
    </div>
  );
};

export default Gallery;