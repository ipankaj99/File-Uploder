import React, { useState } from "react";
import axios from "axios";

function FileUploadM() {
  const [file, setFile] = useState([]);
  const [error, setError] = useState([]);
  const [response, setResponse] = useState("");

  setInterval(()=>{

    
  })

  const LIMIT = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  // FILE UPLOAD + VALIDATION
  const fileUpload = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const validFiles = [];
    const errors = [];

    for (let f of files) {
      // SIZE CHECK
      if (f.size > LIMIT) {
        errors.push(`${f.name} is larger than 5MB`);
        continue;
      }

      // TYPE CHECK
      if (!allowedTypes.includes(f.type)) {
        errors.push(`${f.name} type not allowed`);
        continue;
      }

      // PREVIEW URL
      const url = URL.createObjectURL(f);

      validFiles.push({
        file: f,
        url,
      });
    }

    setFile((prev) => [...prev, ...validFiles]);
    setError(errors);
    
  };

  // PREVIEW
  const handlePreview = (url) => {
    window.open(url, "_blank");
  };

  // UPLOAD TO BACKEND
  const submitFile = async () => {
    try {
      setError([]);

      const formData = new FormData();

      file.forEach((f) => {
        formData.append("file", f.file);
      });

      const res = await axios.post(
        "https://file-uploader-64w8.onrender.com/uploadMultiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse("Upload successful 🚀");
      console.log(res.data);
    } catch (err) {
      setError([
        err.response?.data?.error || err.message,
      ]);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        fontFamily: "Arial",
      }}
    >
      <h2>File Upload</h2>

      {/* INPUT */}
      <input type="file" multiple onChange={fileUpload} />

      {/* FILE LIST */}
      {file.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {file.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <span>{item.file.name}</span>

              <button
                onClick={() => handlePreview(item.url)}
                style={{
                  padding: "6px 10px",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Preview
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error.length > 0 && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {error.map((err, index) => (
            <p key={index}>⚠️ {err}</p>
          ))}
        </div>
      )}

      {/* SUCCESS */}
      {response && (
        <p style={{ color: "green", marginTop: "10px" }}>
          {response}
        </p>
      )}

      {/* UPLOAD BUTTON */}
      <button
        onClick={submitFile}
        disabled={file.length === 0}
        style={{
          marginTop: "15px",
          padding: "10px 15px",
          background: file.length === 0 ? "#ccc" : "#000",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor:
            file.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        Upload
      </button>
    </div>
  );
}

export default FileUploadM;