import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { endpoints } from "../api";
import UploadProgressPanel from "./UploadProgressPanel";

export default function DropZone() {
  const [file, setFile] = useState(null);
  const [dropError, setDropError] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [response, setResponse] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      setDropError(null);
      setUploadError("");

      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile((prev) => {
          if (prev?.url) URL.revokeObjectURL(prev.url);
          return {
            file: selectedFile,
            url: URL.createObjectURL(selectedFile),
          };
        });
      }

      if (fileRejections && fileRejections.length > 0) {
        const rejected = fileRejections[0];
        const message = rejected.errors[0]?.message;
        setDropError(`${rejected.file.name} — ${message}`);
      }
    },
    multiple: false,
    accept: { "image/*": [] },
    disabled: isUploading,
  });

  const clearSelection = () => {
    setFile((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setDropError(null);
    setUploadError("");
    setResponse(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const previewImage = () => {
    if (file?.url) {
      window.open(file.url, "_blank");
    }
  };

  const submitFile = async () => {
    try {
      if (!file) return;

      setUploadError("");
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file.file);

      await axios.post(endpoints.upload, formData, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percent);
        },
      });

      if (file?.url) URL.revokeObjectURL(file.url);
      setFile(null);
      setDropError(null);
      setResponse("Image uploaded successfully.");
      setUploadProgress(100);
      toast.success("Image uploaded");
    } catch {
      setUploadError("Upload failed. You can retry or remove the file.");
      setUploadProgress(0);
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const showPreview = file && !isUploading;
  const canRetry = Boolean(uploadError && file && !isUploading);

  return (
    <div className="uploader">
      <p className="helper-text">
        Drag and drop one image, then click upload.
      </p>

      {!isUploading && !file && (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "dropzone--active" : ""}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="muted">Drop image here...</p>
          ) : (
            <p className="muted">
              Drag & drop image here, or click to select
            </p>
          )}
        </div>
      )}

      {isUploading && (
        <UploadProgressPanel
          percent={uploadProgress}
          label={`Uploading ${file?.file?.name || "image"}...`}
        />
      )}

      {showPreview && (
        <div className="preview-block">
          <img
            className="preview-single"
            src={file.url}
            alt={file.file.name}
          />
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={previewImage}
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

      {dropError && <p className="alert alert--error">{dropError}</p>}
      {uploadError && <p className="alert alert--error">{uploadError}</p>}
      {response && !isUploading && (
        <p className="alert alert--success">{response}</p>
      )}

      <div className="btn-row btn-row--wrap">
        <button
          type="button"
          className="btn btn--primary"
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
    </div>
  );
}
