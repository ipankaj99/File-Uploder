import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const LIMIT = 5 * 1024 * 1024; // 5MB

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  const fileUpload = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setUploadedUrl("");

    if (!selectedFile) return;

    // ✅ SIZE VALIDATION
    if (selectedFile.size > LIMIT) {
      setError("File size must be less than 5MB");
      setFile(null);
      setPreview(null);
      return;
    }

    // ✅ TYPE VALIDATION
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPG, PNG, PDF allowed");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handlePreview = () => {
    if (preview) {
      window.open(preview, "_blank");
    }
  };

  const submitFile = async () => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://file-uploader-64w8.onrender.com/upload",
        formData
      );

      setUploadedUrl(res.data.url);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError("Upload failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>📁 File Upload</h2>

        {/* INPUT */}
        <input type="file" onChange={fileUpload} />

        {/* FILE NAME */}
        {file && (
          <p style={styles.fileName}>📄 {file.name}</p>
        )}

        {/* ERROR */}
        {error && <p style={styles.error}>{error}</p>}

        {/* PREVIEW BUTTON */}
        {preview && (
          <button style={styles.previewBtn} onClick={handlePreview}>
            👀 Preview
          </button>
        )}

        {/* UPLOAD BUTTON */}
        <button
          style={{
            ...styles.uploadBtn,
            opacity: file ? 1 : 0.5,
            cursor: file ? "pointer" : "not-allowed",
          }}
          onClick={submitFile}
          disabled={!file}
        >
          ⬆ Upload
        </button>

        {/* SUCCESS */}
        {uploadedUrl && (
          <p style={styles.success}>
            ✅ Uploaded Successfully
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    fontFamily: "Arial",
  },

  card: {
    width: "380px",
    padding: "20px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  fileName: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
  },

  previewBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  uploadBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },

  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "10px",
  },

  success: {
    color: "green",
    fontSize: "13px",
    marginTop: "10px",
  },
};

export default FileUpload;