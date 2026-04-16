# 📁 React File Upload Components

A collection of reusable React file upload components with validation, preview, and multi-file support.

---

## 📦 Components

| Component | File | Description |
|-----------|------|-------------|
| `FileUpload` | `FileUpload.jsx` | Single file upload with validation |
| `FileUploadM` | `FileUploadM.jsx` | Multiple files upload with validation |
| `DropZone` | `DropZone.jsx` | Drag & drop single image upload |
| `DropZoneM` | `DropZoneM.jsx` | Drag & drop multiple images upload |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- A running backend server at `http://localhost:5000` (see [Backend Setup](#backend-setup))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install
```

### Dependencies

```bash
npm install axios react-dropzone
```

### Run the App

```bash
npm start
```

---

## 🧩 Component Details

---

### 1. `FileUpload` — Single File Upload

> **File:** `FileUpload.jsx`

A clean single-file upload component with built-in size and type validation.

**Features:**
- Accepts JPG, PNG, and PDF files
- File size limit: **5MB**
- Preview file in a new browser tab
- Displays error and success messages
- Upload to backend via `POST /upload`

**Usage:**

```jsx
import FileUpload from "./FileUpload";

function App() {
  return <FileUpload />;
}
```

**Accepted File Types:**
- `image/jpeg`
- `image/png`
- `application/pdf`

**API Endpoint:** `POST http://localhost:5000/upload`  
**Payload:** `multipart/form-data` with field name `file`

---

### 2. `FileUploadM` — Multiple File Upload

> **File:** `FileUploadM.jsx`

Extends single file upload to support multiple files simultaneously.

**Features:**
- Select multiple files at once
- Per-file size and type validation (5MB limit)
- Preview each file individually in a new tab
- Aggregated error display per rejected file
- Upload all files to backend at once via `POST /uploadMultiple`

**Usage:**

```jsx
import FileUploadM from "./FileUploadM";

function App() {
  return <FileUploadM />;
}
```

**Accepted File Types:**
- `image/jpeg`
- `image/png`
- `application/pdf`

**API Endpoint:** `POST http://localhost:5000/uploadMultiple`  
**Payload:** `multipart/form-data` with field name `file` (multiple entries)

---

### 3. `DropZone` — Drag & Drop Single Image Upload

> **File:** `DropZone.jsx`

A drag-and-drop enabled upload zone for a single image, powered by `react-dropzone`.

**Features:**
- Drag & drop or click to select
- Accepts images only (`image/*`)
- Live drag-active visual feedback
- Preview selected image in a new tab
- Upload via `POST /upload`

**Usage:**

```jsx
import DropZone from "./DropZone";

function App() {
  return <DropZone />;
}
```

**Accepted File Types:** All image types (`image/*`)

**API Endpoint:** `POST http://localhost:5000/upload`  
**Payload:** `multipart/form-data` with field name `file`

---

### 4. `DropZoneM` — Drag & Drop Multiple Images Upload

> **File:** `DropZoneM.jsx`

Extends `DropZone` to support dropping and uploading multiple images at once.

**Features:**
- Drop multiple images simultaneously
- Accepts images only (`image/*`)
- Preview each image individually
- Per-file rejection error messages
- Upload all files via `POST /uploadMultiple`

**Usage:**

```jsx
import DropZoneM from "./DropZoneM";

function App() {
  return <DropZoneM />;
}
```

**Accepted File Types:** All image types (`image/*`)

**API Endpoint:** `POST http://localhost:5000/uploadMultiple`  
**Payload:** `multipart/form-data` with field name `file` (multiple entries)

---

## 🖥️ Backend Setup

All components post to a local Express backend. Here's a minimal example to get started:

```bash
npm install express multer cors
```

```js
// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Single file
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Multiple files
app.post("/uploadMultiple", upload.array("file"), (req, res) => {
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

app.listen(5000, () => console.log("Server running on port 5000"));
```

```bash
node server.js
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx       # Single file upload (input-based)
│   ├── FileUploadM.jsx      # Multi file upload (input-based)
│   ├── DropZone.jsx         # Single image drag & drop
│   └── DropZoneM.jsx        # Multi image drag & drop
├── App.jsx
└── index.js
```

---

## ✅ Validation Rules

| Rule | `FileUpload` | `FileUploadM` | `DropZone` | `DropZoneM` |
|------|:---:|:---:|:---:|:---:|
| Max file size 5MB | ✅ | ✅ | ❌ | ❌ |
| Type: JPG/PNG/PDF | ✅ | ✅ | ❌ | ❌ |
| Type: Images only | ❌ | ❌ | ✅ | ✅ |
| Multiple files | ❌ | ✅ | ❌ | ✅ |
| Drag & drop | ❌ | ❌ | ✅ | ✅ |

> **Note:** `DropZone` and `DropZoneM` delegate type validation to `react-dropzone`'s `accept` prop.

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [Axios](https://axios-http.com/)
- [react-dropzone](https://react-dropzone.js.org/)

---
