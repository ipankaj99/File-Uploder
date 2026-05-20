import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function DropZoneM() {
  const [file, setFile] = useState([]);
  const [error, setError] = useState([]);
  const [response, setResponse] = useState();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      setError(null);

      const validFiles = [];
      const invalidFiles = [];

      if (acceptedFiles?.length > 0) {
        acceptedFiles.forEach((f) => {
          const url = URL.createObjectURL(f);

          validFiles.push({
            file: f,
            url,
          });
        });

        setFile((prev) => [...prev, ...validFiles]);
      }

      if (fileRejections?.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          invalidFiles.push(
            `❌ ${file.name} → ${errors[0]?.message}`
          );
        });

        setError(invalidFiles);
      }
    },
    multiple: true,
    accept: { "image/*": [] },
  });

  const previewImage = (item) => {
    if (item?.url) {
      window.open(item.url, "_blank");
    }
  };

  const submitFile = async () => {
    try {
      if (!file.length) return;

      const formData = new FormData();

      file.forEach((f) => {
        formData.append("file", f.file);
      });

      await axios.post("https://file-uploader-64w8.onrender.com/uploadMultiple", formData);

      setFile([]);
      setError([]);
      setResponse("Upload successful ✅");
    } catch (err) {
      setError(["Upload failed ❌"]);
    }
  };

  return (
    <div style={styles.container}>
      {/* TITLE */}
      <h2 style={styles.title}>📤 Upload Images</h2>

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

        <p style={styles.text}>
          {isDragActive
            ? "📂 Drop files here..."
            : "Drag & drop images or click to select"}
        </p>
      </div>

      {/* ERROR */}
      {error?.length > 0 &&
        error.map((err, i) => (
          <p key={i} style={styles.error}>
            {err}
          </p>
        ))}

      {/* SUCCESS */}
      {response && <p style={styles.success}>{response}</p>}

      {/* PREVIEW LIST */}
      {file.length > 0 && (
        <div>
          {file.map((item, index) => (
            <div key={index} style={styles.previewCard}>
              <p style={styles.fileName}>📄 {item.file.name}</p>

              <button
                style={styles.previewBtn}
                onClick={() => previewImage(item)}
              >
                👁 Preview
              </button>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD */}
      <button
        style={{
          ...styles.uploadBtn,
          opacity: file.length > 0 ? 1 : 0.5,
          cursor: file.length > 0 ? "pointer" : "not-allowed",
        }}
        onClick={submitFile}
        disabled={!file.length}
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
    marginTop: "8px",
    fontSize: "14px",
  },

  success: {
    color: "#2ecc71",
    marginTop: "10px",
    fontSize: "14px",
  },

  previewCard: {
    marginTop: "12px",
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