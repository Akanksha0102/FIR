import React, { useState } from "react";
import axios from "axios";

function FormDetails({ setFileId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle file selection
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  // upload to backend
  async function handleUpload() {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "https://fir-kj8w.onrender.com/api/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD RESPONSE:", res.data);

      // send ID to parent
      setFileId(res.data.id);

      alert("File uploaded successfully");

    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 text-white">
      <input type="file" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="btn btn-success mt-3"
      >
        {loading ? "Uploading..." : "Upload FIR"}
      </button>
    </div>
  );
}

export default FormDetails;