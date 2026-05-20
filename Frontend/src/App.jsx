import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import FileUpload from "./components/FileUpload";
import FileUploadM from "./components/FileUploadM";
import DropZone from "./components/DropZone";
import DropZoneM from "./components/DropZoneM";

const THEME_STORAGE_KEY = "file-uploader-theme";

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

const uploadModes = [
  {
    title: "Single File Upload",
    badge: "Basic",
    description: "Quick upload for one file at a time.",
    component: <FileUpload />,
  },
  {
    title: "Multiple File Upload",
    badge: "Batch",
    description: "Select and upload multiple files in one go.",
    component: <FileUploadM />,
  },
  {
    title: "Single Upload with Drag & Drop",
    badge: "Modern",
    description: "Drop one image for a faster interaction.",
    component: <DropZone />,
  },
  {
    title: "Multiple Upload with Drag & Drop",
    badge: "Power",
    description: "Drag several images and upload in a batch.",
    component: <DropZoneM />,
  },
];

function App() {
  const [isDark, setIsDark] = useState(readStoredTheme);

  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [isDark]);

  return (
    <main className="app">
      <Toaster
        position="top-right"
        toastOptions={{ duration: 2500 }}
        theme={isDark ? "dark" : "light"}
      />
      <header className="app__header">
        <p className="app__eyebrow">Production-ready uploader</p>
        <h1 className="app__title">File Upload Dashboard</h1>
        <p className="app__subtitle">
          Professional UI with clear states, validation messaging, and intuitive flows.
        </p>
        <button
          className="btn btn--ghost app__theme-toggle"
          onClick={() => setIsDark((prev) => !prev)}
        >
          {isDark ? "Switch to Light" : "Switch to Dark"}
        </button>
        <div className="app__stats">
          <span className="chip">Formats: JPG, PNG, PDF</span>
          <span className="chip">Max size: 5MB per file</span>
          <span className="chip">4 upload modes</span>
        </div>
      </header>

      <section className="grid">
        {uploadModes.map((mode) => (
          <article className="card card__content" key={mode.title}>
            <div className="card__top">
              <h2 className="card__title">{mode.title}</h2>
              <span className="card__badge">{mode.badge}</span>
            </div>
            <p className="card__description">{mode.description}</p>
            {mode.component}
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;