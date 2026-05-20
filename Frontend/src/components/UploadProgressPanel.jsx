export default function UploadProgressPanel({ percent, label = "Uploading..." }) {
  const safePercent = Math.min(100, Math.max(0, percent || 0));

  return (
    <div className="upload-panel" role="status" aria-live="polite">
      <div className="upload-panel__label">
        <span className="muted">{label}</span>
        <span className="upload-panel__percent">{safePercent}%</span>
      </div>
      <div className="progress progress--lg">
        <div
          className="progress__fill"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}
