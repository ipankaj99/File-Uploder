import React from "react";
import FileUpload from "./components/FileUpload";
import FileUploadM from "./components/FileUploadM";
import DropZone from "./components/DropZone";
import DropZoneM from "./components/DropZoneM";

function App() {
  return (
    <div style={styles.container}>
      
      <h1 style={styles.title}>📁 File Upload System</h1>

      {/* SINGLE UPLOAD */}
      <div style={styles.card}>
        <h2 style={styles.heading}>Single File Upload</h2>
        <FileUpload />
      </div>

      {/* MULTIPLE UPLOAD */}
      <div style={styles.card}>
        <h2 style={styles.heading}>Multiple File Upload</h2>
        <FileUploadM />
      </div>

      {/* //Drop zone */}
       <div style={styles.card}>
        <h2 style={styles.heading}>Single File Upload Using Drag And Drop </h2>
        <DropZone />
      </div>

      <div style={styles.card}>
        <h2 style={styles.heading}>Multiple File Upload Using Drag And Drop</h2>
        <DropZoneM />
      </div>


    </div>
  );
}

const styles = {
  container: {
    minHeight: "20vh",
    padding: "30px",
    background: "#f4f6f8",
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  heading: {
    marginBottom: "15px",
    fontSize: "18px",
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
  },
};

export default App;