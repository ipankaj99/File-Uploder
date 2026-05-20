import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { endpoints } from "../api";
import UploadProgressPanel from "./UploadProgressPanel";
import { isImageFile } from "../utils/fileDisplay";

function newItemId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `f-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function FileUploadM() {
  const [file, setFile] = useState([]);
  const [pickErrors, setPickErrors] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [response, setResponse] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const LIMIT = 5 * 1024 * 1024;
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  const fileUpload = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;
    setUploadProgress(0);
    setResponse("");
    setIsUploading(false);

    const validFiles = [];
    const errors = [];

    for (let f of files) {
      if (f.size > LIMIT) {
        errors.push(`${f.name} is larger than 5MB`);
        continue;
      }

      if (!allowedTypes.includes(f.type)) {
        errors.push(`${f.name} type not allowed`);
        continue;
      }

      validFiles.push({
        id: newItemId(),
        file: f,
        url: URL.createObjectURL(f),
      });
    }

    setFile((prev) => [...prev, ...validFiles]);
    setPickErrors(errors);
    setUploadError("");
  };

  const removeFile = (id) => {
    setFile((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item?.url) URL.revokeObjectURL(item.url);
      return prev.filter((x) => x.id !== id);
    });
    setPickErrors([]);
    setUploadError("");
    setResponse("");
  };

  const handlePreview = (url) => {
    window.open(url, "_blank");
  };

  const submitFile = async () => {
    try {
      setUploadError("");
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      file.forEach((f) => {
        formData.append("file", f.file);
      });

      const res = await axios.post(endpoints.uploadMultiple, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percent);
        },
      });

      file.forEach((f) => {
        if (f.url) URL.revokeObjectURL(f.url);
      });
      setFile([]);
      setResponse("Upload successful.");
      setUploadProgress(100);
      toast.success("All files uploaded");
      console.log(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Upload failed";
      setUploadError(Array.isArray(msg) ? msg.join(", ") : String(msg));
      setUploadProgress(0);
      toast.error("Multi upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const canRetry = Boolean(uploadError && file.length > 0 && !isUploading);
  const showFileList = file.length > 0 && !isUploading;

  return (
    <div className="uploader">
      <input
        className="file-input"
        type="file"
        multiple
        onChange={fileUpload}
        disabled={isUploading}
      />
      <p className="helper-text">
        You can select multiple files (JPG, PNG, PDF up to 5MB each).
      </p>

      {isUploading && (
        <UploadProgressPanel
          percent={uploadProgress}
          label={`Uploading ${file.length} file(s)...`}
        />
      )}

      {showFileList && (
        <>
          <p className="muted">{file.length} file(s) selected</p>
          <ul className="file-list">
            {file.map((item) => (
              <li key={item.id} className="file-item">
                {isImageFile(item.file) ? (
                  <img
                    className="file-item__thumb"
                    src={item.url}
                    alt={item.file.name}
                  />
                ) : (
                  <div className="file-item__thumb file-item__thumb--doc">
                    PDF
                  </div>
                )}
                <span className="file-item__name">{item.file.name}</span>
                <div className="file-item__actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => handlePreview(item.url)}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => removeFile(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {pickErrors.length > 0 && (
        <div>
          {pickErrors.map((err, index) => (
            <p key={index} className="alert alert--error">
              — {err}
            </p>
          ))}
        </div>
      )}

      {uploadError && (
        <p className="alert alert--error">{uploadError}</p>
      )}

      {response && !isUploading && (
        <p className="alert alert--success">{response}</p>
      )}

      <div className="btn-row btn-row--wrap">
        <button
          type="button"
          className="btn btn--primary"
          onClick={submitFile}
          disabled={file.length === 0 || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        {canRetry && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={submitFile}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default FileUploadM;
