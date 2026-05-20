import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { endpoints } from "../api";
import UploadProgressPanel from "./UploadProgressPanel";
import { isImageFile } from "../utils/fileDisplay";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pickError, setPickError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const LIMIT = 5 * 1024 * 1024;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  const fileUpload = (e) => {
    const selectedFile = e.target.files[0];

    setPickError("");
    setUploadError("");
    setUploadedUrl("");
    setUploadProgress(0);
    setIsUploading(false);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (selectedFile.size > LIMIT) {
      setPickError("File size must be less than 5MB");
      setFile(null);
      setPreview(null);
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setPickError("Only JPG, PNG, PDF allowed");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUploadError("");
  };

  const handlePreview = () => {
    if (preview) {
      window.open(preview, "_blank");
    }
  };

  const clearSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setPickError("");
    setUploadError("");
    setUploadedUrl("");
    setUploadProgress(0);
    setIsUploading(false);
  };

  const submitFile = async () => {
    try {
      if (!file) return;

      setUploadError("");
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(endpoints.upload, formData, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percent);
        },
      });

      setUploadedUrl(res.data.url);
      if (preview) URL.revokeObjectURL(preview);
      setFile(null);
      setPreview(null);
      setUploadProgress(100);
      setPickError("");
      setUploadError("");
      toast.success("File uploaded successfully");
    } catch {
      setUploadError("Upload failed");
      setUploadProgress(0);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const showPreview = file && preview && !isUploading;
  const canRetry = Boolean(uploadError && file && !isUploading);

  return (
    <div className="uploader">
      <input
        className="file-input"
        type="file"
        onChange={fileUpload}
        disabled={isUploading}
      />
      <p className="helper-text">Allowed: JPG, PNG, PDF | Max size: 5MB</p>

      {pickError && <p className="alert alert--error">{pickError}</p>}
      {uploadError && <p className="alert alert--error">{uploadError}</p>}

      {isUploading && (
        <UploadProgressPanel
          percent={uploadProgress}
          label={`Uploading ${file?.name || "file"}...`}
        />
      )}

      {showPreview && (
        <div className="preview-block">
          {isImageFile(file) ? (
            <img
              className="preview-single"
              src={preview}
              alt={file.name}
            />
          ) : (
            <div className="preview-single preview-single--doc">
              <span className="preview-single__label">PDF</span>
              <span className="muted">{file.name}</span>
            </div>
          )}
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handlePreview}
            >
              Open
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={clearSelection}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="btn-row btn-row--wrap">
        <button
          className="btn btn--primary"
          type="button"
          onClick={submitFile}
          disabled={!file || isUploading}
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

      {uploadedUrl && !isUploading && (
        <p className="alert alert--success">Uploaded successfully.</p>
      )}
    </div>
  );
}

export default FileUpload;
