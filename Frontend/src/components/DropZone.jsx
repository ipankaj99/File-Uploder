import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function DropZone() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      setError(null);

      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        const url = URL.createObjectURL(selectedFile);

        setFile({
          file: selectedFile,
          url,
        });
      }

      if (fileRejections && fileRejections.length > 0) {
        const rejected = fileRejections[0];
        const message = rejected.errors[0]?.message;

        setError(`${rejected.file.name} → ${message}`);
      }
    },
    multiple: false,
    accept: { "image/*": [] },
  });

  const previewImage = () => {
    if (file?.url) {
      window.open(file.url, "_blank");
    }
  };

  const submitFile = async () => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file.file);

      await axios.post("http://localhost:5000/upload", formData);

      setFile(null);
      setError(null);
      setResponse("Upload successful ✅");
    } catch (err) {
      setError("Upload failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      {/* TITLE */}
      <h2 style={styles.title}>📤 Upload Image</h2>

      {/* DROPZONE */}
      <div
        {...getRootProps()}
        style={{
          ...styles.dropBox,
          background: isDragActive ? "#e6f7ff" : "#fafafa",
          borderColor: isDragActive ? "#1890ff" : "#ccc",
        }}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p style={styles.text}>📂 Drop image here...</p>
        ) : (
          <p style={styles.text}>
            Drag & drop image here, or click to select
          </p>
        )}
      </div>

      {/* ERROR */}
      {error && <p style={styles.error}>{error}</p>}

      {/* SUCCESS */}
      {response && <p style={styles.success}>{response}</p>}

      {/* PREVIEW */}
      {file && (
        <div style={styles.previewCard}>
          <p style={styles.fileName}>📄 {file.file.name}</p>

          <button style={styles.previewBtn} onClick={previewImage}>
            👁 Preview
          </button>
        </div>
      )}

      {/* UPLOAD */}
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
    </div>
  );
}

/* ---------------- UI STYLES ---------------- */
const styles = {
  container: {
    width: "420px",
    margin: "60px auto",
    fontFamily: "Arial",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  dropBox: {
    border: "2px dashed #ccc",
    padding: "45px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer",
  },

  text: {
    margin: 0,
    color: "#666",
  },

  error: {
    color: "#e74c3c",
    marginTop: "10px",
    fontSize: "14px",
  },

  success: {
    color: "#2ecc71",
    marginTop: "10px",
    fontSize: "14px",
  },

  previewCard: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    background: "#f9f9f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  fileName: {
    fontSize: "14px",
    margin: 0,
  },

  previewBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
  },

  uploadBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#1890ff",
    color: "#fff",
    fontWeight: "bold",
  },
};