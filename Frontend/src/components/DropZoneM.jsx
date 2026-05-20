import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { endpoints } from "../api";
import UploadProgressPanel from "./UploadProgressPanel";

function newItemId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `f-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function DropZoneM() {
  const [file, setFile] = useState([]);
  const [rejectErrors, setRejectErrors] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [response, setResponse] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      setRejectErrors([]);
      setUploadError("");

      const validFiles = [];
      const invalidFiles = [];

      if (acceptedFiles?.length > 0) {
        acceptedFiles.forEach((f) => {
          validFiles.push({
            id: newItemId(),
            file: f,
            url: URL.createObjectURL(f),
          });
        });

        setFile((prev) => [...prev, ...validFiles]);
      }

      if (fileRejections?.length > 0) {
        fileRejections.forEach(({ file: rejFile, errors }) => {
          invalidFiles.push(`${rejFile.name} — ${errors[0]?.message}`);
        });

        setRejectErrors(invalidFiles);
      }
    },
    multiple: true,
    accept: { "image/*": [] },
    disabled: isUploading,
  });

  const removeFile = (id) => {
    setFile((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item?.url) URL.revokeObjectURL(item.url);
      return prev.filter((x) => x.id !== id);
    });
    setUploadError("");
    setResponse("");
  };

  const previewImage = (item) => {
    if (item?.url) {
      window.open(item.url, "_blank");
    }
  };

  const submitFile = async () => {
    try {
      if (!file.length) return;

      setUploadError("");
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      file.forEach((f) => {
        formData.append("file", f.file);
      });

      await axios.post(endpoints.uploadMultiple, formData, {
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
      setRejectErrors([]);
      setResponse("Upload successful.");
      setUploadProgress(100);
      toast.success("Bulk image upload complete");
    } catch {
      setUploadError("Upload failed. You can retry.");
      setUploadProgress(0);
      toast.error("Bulk upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const canRetry = Boolean(uploadError && file.length > 0 && !isUploading);
  const showFileList = file.length > 0 && !isUploading;

  return (
    <div className="uploader">
      <p className="helper-text">Drop multiple images for bulk upload.</p>

      {!isUploading && (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "dropzone--active" : ""}`}
        >
          <input {...getInputProps()} />
          <p className="muted">
            {isDragActive
              ? "Drop files here..."
              : "Drag & drop images or click to select"}
          </p>
        </div>
      )}

      {isUploading && (
        <UploadProgressPanel
          percent={uploadProgress}
          label={`Uploading ${file.length} image(s)...`}
        />
      )}

      {showFileList && (
        <>
          <p className="muted">{file.length} file(s) ready to upload</p>
          <ul className="file-list">
            {file.map((item) => (
              <li key={item.id} className="file-item">
                <img
                  className="file-item__thumb"
                  src={item.url}
                  alt={item.file.name}
                />
                <span className="file-item__name">{item.file.name}</span>
                <div className="file-item__actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => previewImage(item)}
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

      {rejectErrors.length > 0 &&
        rejectErrors.map((err, i) => (
          <p key={i} className="alert alert--error">
            {err}
          </p>
        ))}

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
          disabled={!file.length || isUploading}
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
