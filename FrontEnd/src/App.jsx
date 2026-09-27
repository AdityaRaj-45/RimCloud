import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import FileDropzone from "./components/transfer/FileDropZone";
import RetrieveTransfer from "./components/transfer/RetrieveTransfer";
import UploadProgress from "./components/transfer/UploadProgress";
import ShareResult from "./components/transfer/ShareResult";
import Toast from "./components/ui/Toast";

import {
  uploadFile,
  getTransfer,
} from "./services/api";

import "./App.css";
const MAX_FILE_SIZE = 100 * 1024 * 1024;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [shareData, setShareData] = useState(null);

  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  async function handleFileSelected(file) {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast(
        "File is too large. Maximum size is 100 MB.",
        "error"
      );
      return;
    }

    setSelectedFile(file);
    setShareData(null);

    showToast("File selected");
  }

  async function handleUpload() {
    if (!selectedFile) {
      showToast("Choose a file first", "error");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const data = await uploadFile(
        selectedFile,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setShareData({
        type: "file",
        code: data.code,
        qrCode: data.qrCode,
        url: data.url,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        downloadUrl: data.files?.[0]?.downloadUrl,
      });

      showToast("Upload complete");
    } catch (error) {
      console.error(error);

      showToast(
        "Upload failed. Please try again.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleRetrieveFile(code) {
    if (!code.trim()) {
      showToast("Enter an access code", "error");
      return;
    }

    try {
      const data = await getTransfer(code.trim());

      if (data.type === "file" && data.files?.[0]) {
        const file = data.files[0];
        setShareData({
          type: "file",
          code: data.code,
          url: `${import.meta.env.VITE_API_URL}/api/transfers/${data.code}`,
          fileName: file.name,
          fileSize: file.size,
          downloadUrl: file.downloadUrl,
        });
        showToast("File retrieved");
      } else {
        showToast("That code isn't a file transfer.", "error");
      }
    } catch {
      showToast(
        "That code doesn't exist or has expired.",
        "error"
      );
    }
  }

  function handleReset() {
    setSelectedFile(null);
    setShareData(null);
    setUploadProgress(0);
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="workspace-card">
          {!uploading && !shareData && (
            <FileDropzone
              selectedFile={selectedFile}
              onFileSelected={handleFileSelected}
              onUpload={handleUpload}
              onRemove={() => setSelectedFile(null)}
            />
          )}

          {uploading && (
            <UploadProgress
              progress={uploadProgress}
              file={selectedFile}
            />
          )}
          {!shareData && (
            <RetrieveTransfer
              onRetrieve={handleRetrieveFile}
              loading={false}
            />
          )}
          {shareData && (
            <ShareResult
              data={shareData}
              onReset={handleReset}
            />
          )}
        </section>

        <footer className="page-footer">
          <span>Fast, simple sharing.</span>

          <span>
            <span className="footer-dot" />
            RimCloud
          </span>
        </footer>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}
    </div>
  );
}

export default App;